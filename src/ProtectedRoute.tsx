import React from 'react';
import { Navigate } from 'react-router-dom';

interface Props {
  user: any | null;
  requiredRole?: 'rider' | 'driver' | 'admin';
  children: React.ReactElement;
}

export default function ProtectedRoute({ user, requiredRole, children }: Props) {
  if (!user) return <Navigate to="/login" replace />;
  if (requiredRole && user.role !== requiredRole) return <Navigate to="/login" replace />;
  return children;
}
