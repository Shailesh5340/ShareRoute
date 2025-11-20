import React, { useEffect, useState } from 'react';
import { API_BASE } from './config';

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    fetchUsers();
    fetchBookings();
  }, []);

  const fetchUsers = async () => {
    try {
      const resp = await fetch(`${API_BASE}/api/admin/users`, { credentials: 'include' });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.message || 'Failed');
      setUsers(data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBookings = async () => {
    try {
      const resp = await fetch(`${API_BASE}/api/bookings`, { credentials: 'include' });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.message || 'Failed');
      setBookings(data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const setRole = async (id: string, role: string) => {
    try {
      const resp = await fetch(`${API_BASE}/api/admin/users/${id}/role`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.message || 'Failed');
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-gray-800/60 rounded-lg border border-gray-700">
      <h3 className="text-white text-lg font-semibold mb-4">Admin Dashboard</h3>
      <section className="mb-6">
        <h4 className="text-white font-semibold mb-2">Users</h4>
        <div className="space-y-2">
          {users.map(u => (
            <div key={u._id} className="p-2 bg-gray-700/30 rounded flex justify-between">
              <div className="text-gray-200">{u.name} — {u.email} — {u.role}</div>
              <div>
                <select value={u.role} onChange={e => setRole(u._id, e.target.value)} className="bg-gray-700 text-white p-1 rounded">
                  <option value="rider">rider</option>
                  <option value="driver">driver</option>
                  <option value="admin">admin</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h4 className="text-white font-semibold mb-2">Bookings</h4>
        <div className="space-y-2">
          {bookings.map(b => (
            <div key={b._id} className="p-2 bg-gray-700/30 rounded">
              <div className="text-white">{b.pickupLocation} → {b.destination}</div>
              <div className="text-sm text-gray-300">Status: {b.status} — Rider: {b.rider || 'N/A'} — Driver: {b.driver || 'N/A'}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
