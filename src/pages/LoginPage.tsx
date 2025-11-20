import React from 'react';
import Login from '../Login';

export default function LoginPage({ onLogin }:{ onLogin:(u:any)=>void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <Login onLogin={onLogin} />
    </div>
  );
}
