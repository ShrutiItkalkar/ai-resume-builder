import { Bell, Search, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function Header({ title, subtitle, onToggleSidebar }) {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const getInitials = (name) => {
    if (!name) return 'JD';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const displayTitle = title === 'Dashboard'
    ? `Good morning, ${user?.name?.split(' ')[0] || 'John'}! 👋`
    : title;

  return (
    <header
      className="no-print"
      style={{
        height: '72px',
        backgroundColor: 'var(--header-bg)',
        borderBottom: '1px solid var(--border-color)',
        padding: '0 2.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        flexShrink: 0,
        transition: 'background-color 0.2s ease, border-color 0.2s ease',
      }}
    >
      {/* Left: Title & Subtitle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Mobile Hamburger */}
        <button
          onClick={onToggleSidebar}
          className="md:hidden"
          style={{
            background: 'none', border: 'none', padding: '0.35rem',
            color: 'var(--text-main)', cursor: 'pointer', borderRadius: '6px',
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
            <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', lineHeight: 1.2 }}>
              {displayTitle}
            </h1>
          )}
          {subtitle && (
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right: Search + Bell + Theme Toggle + User Badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: 'auto' }}>
        {/* Search Icon Button */}
        <button
          className="header-icon-btn"
          title="Search"
          onClick={() => alert('Search clicked')}
        >
          <Search size={18} color={theme === 'dark' ? '#F5F2EA' : '#3D2E21'} strokeWidth={2.2} />
        </button>

        {/* Notification Icon Button */}
        <button
          className="header-icon-btn"
          title="Notifications"
          onClick={() => alert('Notifications clicked')}
        >
          <Bell size={18} color={theme === 'dark' ? '#F5F2EA' : '#3D2E21'} strokeWidth={2.2} />
          <span style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            backgroundColor: '#B28A4A',
          }} />
        </button>

        {/* Dark / Light Mode Toggle Button */}
        <button
          onClick={toggleTheme}
          className="header-icon-btn"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? (
            <Sun size={18} color="#C69F5D" strokeWidth={2.2} />
          ) : (
            <Moon size={18} color="#3D2E21" strokeWidth={2.2} />
          )}
        </button>

        {/* User Initials Badge */}
        <div
          style={{
            width: '40px',
            height: '40px',
            minWidth: '40px',
            minHeight: '40px',
            borderRadius: '50%',
            backgroundColor: '#E9DFCF',
            color: '#3D2E21',
            fontWeight: '700',
            fontSize: '0.85rem',
            lineHeight: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
            margin: 0,
            cursor: 'pointer',
            flexShrink: 0,
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          {getInitials(user?.name)}
        </div>
      </div>
    </header>
  );
}
