import React, { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { API_BASE } from './config';

interface Props { user: any }

let socket: Socket | null = null;

export default function DriverDashboard({ user }: Props) {
  const [requests, setRequests] = useState<any[]>([]);
  const [sharing, setSharing] = useState(false);
  const shareIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!user) return;
    socket = io(API_BASE, { transports: ['websocket'], withCredentials: true });

    socket.on('connect', () => {
      socket?.emit('join', user.id);
    });

    socket.on('new_ride_request', (data) => {
      setRequests((r) => [data.booking || data, ...r]);
    });

    return () => {
      socket?.disconnect();
      socket = null;
    };
  }, [user]);

  const accept = async (bookingId: string) => {
    try {
      const resp = await fetch(`${API_BASE}/api/bookings/${bookingId}/accept`, { method: 'POST', credentials: 'include' });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.message || 'Accept failed');
      // remove from requests
      setRequests((r) => r.filter(x => String(x._id || x.booking?._id) !== bookingId));
    } catch (err) {
      console.error(err);
      alert('Accept failed');
    }
  };

  const toggleShare = () => {
    if (!sharing) {
      // start sharing mock location every 5s
      shareIntervalRef.current = window.setInterval(() => {
        if (!socket) return;
        const lat = 37.7749 + (Math.random() - 0.5) * 0.01;
        const lng = -122.4194 + (Math.random() - 0.5) * 0.01;
        socket.emit('driver_location', { driverId: user.id, lat, lng, eta: Math.floor(Math.random() * 10) + 1, riderId: null });
      }, 5000);
      setSharing(true);
    } else {
      if (shareIntervalRef.current) {
        clearInterval(shareIntervalRef.current);
        shareIntervalRef.current = null;
      }
      setSharing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 bg-gray-800/60 rounded-lg border border-gray-700">
      <h3 className="text-white text-lg font-semibold mb-4">Driver Dashboard</h3>
      <div className="mb-3">
        <button onClick={toggleShare} className="px-4 py-2 bg-emerald-500 rounded">{sharing ? 'Stop Sharing Location' : 'Start Sharing Location'}</button>
      </div>

      <div className="space-y-3">
        {requests.length === 0 && <div className="text-gray-400">No incoming requests</div>}
        {requests.map((req, idx) => {
          const booking = req.booking || req;
          return (
            <div key={idx} className="p-3 bg-gray-700/30 rounded flex justify-between items-center">
              <div>
                <div className="text-white">{booking.pickupLocation} → {booking.destination}</div>
                <div className="text-sm text-gray-300">{booking.passengerName || 'Anonymous'}</div>
              </div>
              <div>
                <button onClick={() => accept(String(booking._id))} className="px-3 py-1 bg-emerald-500 rounded">Accept</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
