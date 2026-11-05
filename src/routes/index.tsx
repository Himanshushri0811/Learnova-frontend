import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout';
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { StudentLoginPage } from '../pages/auth/StudentLoginPage';
import { AdminLoginPage } from '../pages/auth/AdminLoginPage';
import { AdminDashboard } from '../pages/dashboards/AdminDashboard';
import { StudentDashboard } from '../pages/dashboards/StudentDashboard';
import { GuardianDashboard } from '../pages/dashboards/GuardianDashboard';
import { ProtectedRoute } from '../components/common/ProtectedRoute';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
      </Route>

      {/* Two Dedicated Login Experiences */}
      <Route path="/student/login" element={<StudentLoginPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Role-Based Dashboard Roots */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/*"
        element={
          <ProtectedRoute requiredRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/guardian/*"
        element={
          <ProtectedRoute requiredRole="guardian">
            <GuardianDashboard />
          </ProtectedRoute>
        }
      />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

