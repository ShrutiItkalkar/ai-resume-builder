import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AppLayout from './components/common/AppLayout';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ResumesPage from './pages/ResumesPage';
import AiToolsPage from './pages/AiToolsPage';
import AtsPage from './pages/AtsPage';
import SettingsPage from './pages/SettingsPage';
import ResumeEditorPage from './pages/ResumeEditorPage';

export default function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            {/* Public */}
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/login"
              element={
                <AppLayout hideSidebar title="Welcome back" subtitle="Sign in to your account">
                  <LoginPage />
                </AppLayout>
              }
            />
            <Route
              path="/signup"
              element={
                <AppLayout hideSidebar title="Create account" subtitle="Start building AI-powered resumes">
                  <SignupPage />
                </AppLayout>
              }
            />

            {/* Protected — Main App */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <AppLayout title="Dashboard" subtitle="Build a resume that gets you noticed.">
                    <DashboardPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/resumes"
              element={
                <ProtectedRoute>
                  <AppLayout title="My Resumes" subtitle="Manage and improve your resumes.">
                    <ResumesPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/ai-tools"
              element={
                <ProtectedRoute>
                  <AppLayout title="AI Career Assistant" subtitle="Powered by Gemini — optimize every section of your resume.">
                    <AiToolsPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/ats"
              element={
                <ProtectedRoute>
                  <AppLayout title="ATS Score" subtitle="Check how well your resume passes applicant tracking systems.">
                    <AtsPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <AppLayout title="Settings" subtitle="Manage your account and preferences.">
                    <SettingsPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            {/* Resume Editor */}
            <Route
              path="/resume/new"
              element={
                <ProtectedRoute>
                  <AppLayout title="New Resume" subtitle="Create a new AI-powered resume.">
                    <ResumeEditorPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/resume/:id"
              element={
                <ProtectedRoute>
                  <AppLayout title="Resume Preview" subtitle="Preview your resume before exporting.">
                    <ResumeEditorPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/resume/:id/edit"
              element={
                <ProtectedRoute>
                  <AppLayout title="Edit Resume" subtitle="Update your resume details and AI content.">
                    <ResumeEditorPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}
