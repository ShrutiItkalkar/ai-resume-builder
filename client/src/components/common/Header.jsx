import { Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Header({ title, subtitle, onToggleSidebar }) {
  const { user } = useAuth();

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header
      className="no-print"
      style={{
        height: '65px',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #EEEBF8',
        padding: '0 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        flexShrink: 0,
      }}
    >
      {/* Left: Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Mobile hamburger */}
        <button
          onClick={onToggleSidebar}
          className="md:hidden"
          style={{
            background: 'none', border: 'none', padding: '0.35rem',
            color: '#6B6875', cursor: 'pointer', borderRadius: '6px',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <div>
          {title && (
            <h1 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: '#17151F', lineHeight: 1.2 }}>
              {title}
            </h1>
          )}
          {subtitle && (
            <p style={{ margin: 0, fontSize: '0.78rem', color: '#9CA3AF', marginTop: '0.1rem' }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right: Notifications + Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button style={{
          background: 'none', border: '1px solid #E9E6F2', borderRadius: '8px',
          width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#6B6875', cursor: 'pointer',
        }}>
          <Bell size={16} />
        </button>

        <div style={{
          width: '34px', height: '34px', borderRadius: '50%', backgroundColor: '#7C5CFC',
          color: '#FFFFFF', fontWeight: '700', fontSize: '0.8rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 6px rgba(124,92,252,0.3)',
          cursor: 'pointer',
          flexShrink: 0,
        }}>
          {getInitials(user?.name)}
        </div>
      </div>
    </header>
  );
}
