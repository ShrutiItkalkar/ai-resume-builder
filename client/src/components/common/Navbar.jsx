import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar" style={{
      display: 'flex',
      justify: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      backgroundColor: '#1e293b',
      color: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div className="nav-brand">
        <Link to={isLoggedIn ? "/dashboard" : "/"} style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.25rem' }}>
          📄 AI Resume Builder
        </Link>
      </div>

      <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {isLoggedIn ? (
          <>
            <Link to="/dashboard" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Dashboard</Link>
            <Link to="/resume/new" style={{ color: '#cbd5e1', textDecoration: 'none' }}>+ Create Resume</Link>
            <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
              👤 {user?.name || user?.email}
            </span>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: '#ef4444',
                color: '#fff',
                border: 'none',
                padding: '0.4rem 0.8rem',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Login</Link>
            <Link
              to="/signup"
              style={{
                backgroundColor: '#2563eb',
                color: '#fff',
                textDecoration: 'none',
                padding: '0.4rem 0.8rem',
                borderRadius: '4px'
              }}
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
