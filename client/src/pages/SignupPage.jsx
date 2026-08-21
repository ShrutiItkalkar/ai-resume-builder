import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, UserPlus } from 'lucide-react';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) { setError('All fields are required.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setError('');
    setIsSubmitting(true);
    try {
      await signup(name, email, password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Signup failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '420px', margin: '0 auto', paddingTop: '1rem' }}>
      {/* Brand */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{
          width: '50px', height: '50px', borderRadius: '14px',
          background: 'linear-gradient(135deg, #7C5CFC 0%, #9B8AFB 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#FFFFFF', margin: '0 auto 1rem', boxShadow: '0 6px 16px rgba(124,92,252,0.3)',
        }}>
          <Sparkles size={24} />
        </div>
        <h2 style={{ margin: '0 0 0.35rem', fontSize: '1.5rem', fontWeight: '800', color: '#17151F' }}>
          Create your account
        </h2>
        <p style={{ margin: 0, color: '#9CA3AF', fontSize: '0.875rem' }}>
          Start building AI-powered resumes for free
        </p>
      </div>

      {/* Card */}
      <div style={{
        backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid #E9E6F2',
        padding: '2rem', boxShadow: '0 4px 24px rgba(23,21,31,0.07)',
      }}>
        {error && (
          <div style={{
            padding: '0.75rem 1rem', marginBottom: '1.25rem',
            backgroundColor: '#FEF2F2', color: '#DC2626',
            borderRadius: '10px', fontSize: '0.875rem', fontWeight: '500',
            border: '1px solid #FCA5A5',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div>
            <label htmlFor="name">Full Name</label>
            <input
              id="name" type="text" value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              disabled={isSubmitting} required
            />
          </div>

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
              placeholder="Min. 6 characters"
              disabled={isSubmitting} required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary"
            style={{ width: '100%', padding: '0.75rem', marginTop: '0.25rem', fontSize: '0.9rem' }}
          >
            <UserPlus size={16} />
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
      </div>

      <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#9CA3AF' }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: '#7C5CFC', fontWeight: '600' }}>Sign in</Link>
      </p>
    </div>
  );
}
