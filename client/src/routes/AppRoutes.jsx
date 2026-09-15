import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';

// PM Pages
import PMDashboard from '../pages/PMDashboard';
import PMProjectsPage from '../pages/pm/PMProjectsPage';
import PMProjectDetailPage from '../pages/pm/PMProjectDetailPage';
import PMActivitiesPage from '../pages/pm/PMActivitiesPage';
import PMRisksPage from '../pages/pm/PMRisksPage';
import PMApprovalsPage from '../pages/pm/PMApprovalsPage';

// SE Pages
import SEDashboard from '../pages/SEDashboard';
import SEActivitiesPage from '../pages/se/SEActivitiesPage';
import SEProgressPage from '../pages/se/SEProgressPage';
import SEEvidencePage from '../pages/se/SEEvidencePage';

// Route Guards
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Project Manager Protected Routes */}
      <Route
        path="/pm/dashboard"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRole="PROJECT_MANAGER">
              <PMDashboard />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/pm/projects"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRole="PROJECT_MANAGER">
              <PMProjectsPage />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/pm/projects/:projectId"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRole="PROJECT_MANAGER">
              <PMProjectDetailPage />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/pm/activities"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRole="PROJECT_MANAGER">
              <PMActivitiesPage />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/pm/risks"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRole="PROJECT_MANAGER">
              <PMRisksPage />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/pm/approvals"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRole="PROJECT_MANAGER">
              <PMApprovalsPage />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      {/* Site Engineer Protected Routes */}
      <Route
        path="/se/dashboard"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRole="SITE_ENGINEER">
              <SEDashboard />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/se/activities"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRole="SITE_ENGINEER">
              <SEActivitiesPage />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/se/progress"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRole="SITE_ENGINEER">
              <SEProgressPage />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/se/evidence"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRole="SITE_ENGINEER">
              <SEEvidencePage />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
