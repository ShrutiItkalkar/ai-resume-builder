import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

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
    <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', backgroundColor: '#fff' }}>
      <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Welcome Back</h2>
      
      {error && (
        <div style={{ padding: '0.75rem', marginBottom: '1rem', backgroundColor: '#fef2f2', color: '#dc2626', borderRadius: '4px', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }} htmlFor="email">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            disabled={isSubmitting}
            required
            style={{ width: '100%', padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '4px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }} htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            disabled={isSubmitting}
            required
            style={{ width: '100%', padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '4px', boxSizing: 'border-box' }}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{ width: '100%', padding: '0.75rem', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
        >
          {isSubmitting ? 'Logging in...' : 'Log In'}
        </button>
      </form>

      <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: '#64748b' }}>
        Don't have an account? <Link to="/signup" style={{ color: '#2563eb' }}>Sign up</Link>
      </p>
    </div>
  );
}
