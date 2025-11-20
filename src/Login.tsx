import React, { useState } from 'react';
import { API_BASE } from './config';

interface Props {
  onLogin: (user: any) => void;
}

export default function Login({ onLogin }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'rider'|'driver'>('rider');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const url = isRegister ? '/api/auth/register' : '/api/auth/login';
      const body: any = { email, password };
      if (isRegister) body.name = name; body.role = role;

      const resp = await fetch(`${API_BASE}${url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      const data = await resp.json();
      if (!resp.ok) throw new Error(data.message || 'Auth failed');

      // Server sets HTTP-only cookie; we get user in response
      onLogin(data.data.user);
    } catch (err: any) {
      setError(err.message || 'Auth error');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-gray-800/60 rounded-lg border border-gray-700">
      <h3 className="text-white text-lg font-semibold mb-2">{isRegister ? 'Register' : 'Login'}</h3>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      <form onSubmit={submit} className="space-y-3">
        {isRegister && (
          <input required value={name} onChange={e => setName(e.target.value)} placeholder="Full name" className="w-full p-2 rounded bg-gray-700 text-white" />
        )}
        <input required value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" className="w-full p-2 rounded bg-gray-700 text-white" />
        <input required value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" className="w-full p-2 rounded bg-gray-700 text-white" />
        {isRegister && (
          <select value={role} onChange={e => setRole(e.target.value as any)} className="w-full p-2 rounded bg-gray-700 text-white">
            <option value="rider">Rider</option>
            <option value="driver">Driver</option>
          </select>
        )}
        <div className="flex items-center justify-between">
          <button className="px-4 py-2 bg-emerald-500 text-black rounded font-semibold">{isRegister ? 'Register' : 'Login'}</button>
          <button type="button" onClick={() => setIsRegister(s => !s)} className="text-sm text-gray-300">{isRegister ? 'Have an account? Login' : 'Create account'}</button>
        </div>
      </form>
    </div>
  );
}
