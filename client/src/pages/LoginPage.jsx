import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FileCheck, LogIn } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('Email and password are required.'); return; }
    setError('');
    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '420px', margin: '0 auto', paddingTop: '2rem' }}>
      {/* Brand */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{
          width: '52px', height: '52px', borderRadius: '14px',
          backgroundColor: '#3D2E21',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#F7F3EA', margin: '0 auto 1rem', boxShadow: '0 6px 16px rgba(61,46,33,0.2)',
        }}>
          <FileCheck size={26} />
        </div>
        <h2 style={{ margin: '0 0 0.35rem', fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-main)' }}>
          Welcome back
        </h2>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Build a resume that gets you noticed.
        </p>
      </div>

      {/* Card */}
      <div style={{
        backgroundColor: 'var(--card-bg)', borderRadius: '20px', border: '1px solid var(--border-color)',
        padding: '2.25rem', boxShadow: 'var(--shadow-md)',
      }}>
        {error && (
          <div style={{
            padding: '0.75rem 1rem', marginBottom: '1.25rem',
            backgroundColor: 'var(--error-bg)', color: 'var(--error)',
            borderRadius: '10px', fontSize: '0.875rem', fontWeight: '500',
            border: '1px solid #FCA5A5',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div>
            <label htmlFor="email">Email Address</label>
            <input
              id="email" type="email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={isSubmitting} required
            />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input
              id="password" type="password" value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isSubmitting} required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary"
            style={{ width: '100%', padding: '0.8rem', marginTop: '0.35rem', fontSize: '0.9rem' }}
          >
            <LogIn size={16} />
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>

      <p style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
        Don't have an account?{' '}
        <Link to="/signup" style={{ color: '#8B7355', fontWeight: '700' }}>Create account</Link>
      </p>
    </div>
  );
}
