import React from 'react';
import { Navigate } from 'react-router-dom';
import { UserRole } from '../../types';

interface ProtectedRouteProps {
  requiredRole: UserRole;
  children: React.ReactElement;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requiredRole,
  children,
}) => {
  const token = localStorage.getItem('learnova_token');
  const storedUser = localStorage.getItem('learnova_user');

  if (!token || !storedUser) {
    // Redirect to the appropriate login page based on target role
    return <Navigate to={requiredRole === 'admin' ? '/admin/login' : '/student/login'} replace />;
  }

  try {
    const user = JSON.parse(storedUser);
    if (user.role !== requiredRole) {
      // If signed in under another role, redirect to their valid dashboard
      if (user.role === 'admin') {
        return <Navigate to="/admin" replace />;
      }
      if (user.role === 'student') {
        return <Navigate to="/student" replace />;
      }
      return <Navigate to="/login" replace />;
    }
  } catch {
    localStorage.removeItem('learnova_token');
    localStorage.removeItem('learnova_user');
    return <Navigate to="/student/login" replace />;
  }

  return children;
};

