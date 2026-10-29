import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout';
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { AdminDashboard } from '../pages/dashboards/AdminDashboard';
import { StudentDashboard } from '../pages/dashboards/StudentDashboard';
import { GuardianDashboard } from '../pages/dashboards/GuardianDashboard';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
      </Route>

      {/* Authentication */}
      <Route path="/login" element={<LoginPage />} />

      {/* Role-Based Dashboard Roots */}
      <Route path="/admin/*" element={<AdminDashboard />} />
      <Route path="/student/*" element={<StudentDashboard />} />
      <Route path="/guardian/*" element={<GuardianDashboard />} />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

