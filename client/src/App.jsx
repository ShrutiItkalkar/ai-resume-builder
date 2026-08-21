import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/auth/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ResumeEditorPage from './pages/ResumeEditorPage';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-container" style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
          <Navbar />
          <main style={{ paddingBottom: '3rem' }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/resume/new"
                element={
                  <ProtectedRoute>
                    <ResumeEditorPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/resume/:id"
                element={
                  <ProtectedRoute>
                    <ResumeEditorPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/resume/:id/edit"
                element={
                  <ProtectedRoute>
                    <ResumeEditorPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}
