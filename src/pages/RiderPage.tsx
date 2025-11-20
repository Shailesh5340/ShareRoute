import React from 'react';
import RiderDashboard from '../RiderDashboard';

export default function RiderPage({ user }:{ user:any }) {
  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <RiderDashboard user={user} />
    </div>
  );
}
