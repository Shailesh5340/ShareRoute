import React from 'react';
import DriverDashboard from '../DriverDashboard';

export default function DriverPage({ user }:{ user:any }) {
  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <DriverDashboard user={user} />
    </div>
  );
}
