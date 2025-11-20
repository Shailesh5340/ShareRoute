import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { API_BASE } from './config';

interface Props { user: any }

let socket: Socket | null = null;

export default function RiderDashboard({ user }: Props) {
  const [accepted, setAccepted] = useState<any | null>(null);
  const [driverLocation, setDriverLocation] = useState<any | null>(null);

  useEffect(() => {
    if (!user) return;
    socket = io(API_BASE, { transports: ['websocket'], withCredentials: true });

    socket.on('connect', () => {
      socket?.emit('join', user.id);
    });

    socket.on('ride_accepted', (data) => {
      setAccepted(data.booking);
    });

    socket.on('driver_location', (data) => {
      setDriverLocation(data);
    });

    return () => {
      socket?.disconnect();
      socket = null;
    };
  }, [user]);

  return (
    <div className="max-w-3xl mx-auto p-4 bg-gray-800/60 rounded-lg border border-gray-700">
      <h3 className="text-white text-lg font-semibold mb-4">Rider Dashboard</h3>
      <p className="text-gray-300 mb-4">Hi, {user?.name}. Waiting for driver acceptance...</p>

      {accepted ? (
        <div className="p-4 bg-gray-700/40 rounded">
          <div className="text-white font-semibold">Driver assigned</div>
          <div className="text-gray-300">Driver ID: {accepted.driver}</div>
        </div>
      ) : (
        <div className="text-gray-400">No driver yet</div>
      )}

      {driverLocation && (
        <div className="mt-3 p-3 bg-gray-700/30 rounded">
          <div className="text-sm text-gray-200">Driver location: {driverLocation.lat}, {driverLocation.lng}</div>
          <div className="text-sm text-gray-200">ETA: {driverLocation.eta || 'N/A'} mins</div>
        </div>
      )}
    </div>
  );
}
