import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function RoleRoute({ allowedRole, children }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bg">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
          <p className="text-sm text-brand-muted font-medium">Validating authorization...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user role matches allowedRole
  if (user?.role !== allowedRole) {
    // Redirect user to their own role-based dashboard
    if (user?.role === 'PROJECT_MANAGER') {
      return <Navigate to="/pm/dashboard" replace />;
    } else if (user?.role === 'SITE_ENGINEER') {
      return <Navigate to="/se/dashboard" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return children;
}
