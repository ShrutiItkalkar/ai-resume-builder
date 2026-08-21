import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const { isLoggedIn } = useAuth();

  return (
    <div style={{ textAlign: 'center', padding: '4rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#0f172a' }}>
        Build Resume Tailored to Any Job in Seconds with AI
      </h1>
      <p style={{ fontSize: '1.2rem', color: '#475569', marginBottom: '2.5rem' }}>
        Create ATS-optimized, high-impact resumes with automated experience bullet generation and skill matching.
      </p>
      
      <div>
        {isLoggedIn ? (
          <Link
            to="/dashboard"
            style={{
              backgroundColor: '#2563eb',
              color: '#fff',
              padding: '0.8rem 1.8rem',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '1.1rem'
            }}
          >
            Go to Dashboard
          </Link>
        ) : (
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link
              to="/signup"
              style={{
                backgroundColor: '#2563eb',
                color: '#fff',
                padding: '0.8rem 1.8rem',
                borderRadius: '6px',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '1.1rem'
              }}
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              style={{
                backgroundColor: '#f1f5f9',
                color: '#334155',
                padding: '0.8rem 1.8rem',
                borderRadius: '6px',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                border: '1px solid #cbd5e1'
              }}
            >
              Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
