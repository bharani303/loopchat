import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';

// Lazy-load all pages — critical for mobile LCP / Performance score
const Landing          = lazy(() => import('./pages/Landing'));
const Login            = lazy(() => import('./pages/Login'));
const Dashboard        = lazy(() => import('./pages/Dashboard'));
const ProfileSetup     = lazy(() => import('./pages/ProfileSetup'));
const CreateAccount    = lazy(() => import('./pages/CreateAccount'));
const OtpVerification  = lazy(() => import('./pages/OtpVerification'));
const ForgotPassword   = lazy(() => import('./pages/ForgotPassword'));
const RandomChat       = lazy(() => import('./pages/RandomChat'));
const NotFound         = lazy(() => import('./pages/NotFound'));
const UnderConstruction = lazy(() => import('./pages/UnderConstruction'));

// Minimal loading fallback — prevents layout shift, shows instantly
const PageLoader = () => (
  <div
    role="status"
    aria-label="Loading page"
    style={{
      minHeight: '100dvh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#09090b',
    }}
  >
    <div style={{
      width: 40,
      height: 40,
      border: '3px solid rgba(139,92,246,0.2)',
      borderTopColor: '#8b5cf6',
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { token, isLoading } = useAuth();
  if (isLoading) return <PageLoader />;
  if (!token) return <Navigate to="/login" replace />;
  return <ChatProvider>{children}</ChatProvider>;
};

const LandingWrapper = () => {
  const navigate = useNavigate();
  return <Landing onNavigate={(route) => navigate(`/${route}`)} />;
};

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<LandingWrapper />} />
            <Route path="/login" element={<Login />} />
            <Route path="/create-account" element={<CreateAccount />} />
            <Route path="/verify-otp" element={<OtpVerification />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/random-chat"
              element={
                <ProtectedRoute>
                  <RandomChat />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile-setup"
              element={
                <ProtectedRoute>
                  <ProfileSetup />
                </ProtectedRoute>
              }
            />

            <Route path="/under-construction" element={<UnderConstruction />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
  );
}

