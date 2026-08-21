import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  FileText,
  Sparkles,
  Target,
  Settings,
  LogOut,
  X,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'My Resumes', path: '/resumes', icon: FileText },
  { label: 'AI Tools', path: '/ai-tools', icon: Sparkles, badge: 'AI' },
  { label: 'ATS Score', path: '/ats', icon: Target },
  { label: 'Settings', path: '/settings', icon: Settings },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0,
            backgroundColor: 'rgba(23, 21, 31, 0.35)',
            zIndex: 40, backdropFilter: 'blur(2px)',
          }}
          className="md:hidden"
        />
      )}

      <aside
        style={{
          width: '250px',
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid #EEEBF8',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          position: 'fixed',
          top: 0, left: 0,
          zIndex: 50,
          transition: 'transform 0.22s ease-in-out',
        }}
        className={`app-sidebar ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Logo */}
        <div style={{
          padding: '1.4rem 1.4rem 1.1rem',
          borderBottom: '1px solid #F5F3FF',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', textDecoration: 'none' }}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '9px',
              background: 'linear-gradient(135deg, #7C5CFC 0%, #9B8AFB 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#FFFFFF', boxShadow: '0 3px 8px rgba(124,92,252,0.28)',
            }}>
              <Sparkles size={18} />
            </div>
            <div>
              <span style={{
                fontSize: '1.1rem', fontWeight: '800', color: '#17151F',
                letterSpacing: '-0.03em', lineHeight: '1.1',
              }}>
                Resume<span style={{ color: '#7C5CFC' }}>AI</span>
              </span>
              <div style={{ fontSize: '0.66rem', color: '#9CA3AF', fontWeight: '500' }}>
                Smart Resume Builder
              </div>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="md:hidden"
            style={{ background: 'none', border: 'none', padding: '0.2rem', color: '#9CA3AF', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav style={{ padding: '1.1rem 0.85rem', flex: 1 }}>
          <div style={{
            fontSize: '0.67rem', fontWeight: '700', textTransform: 'uppercase',
            letterSpacing: '0.08em', color: '#C4BEDB',
            padding: '0 0.65rem 0.6rem',
          }}>
            Menu
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              // Exact match for dashboard; prefix match for others
              const isActive = item.path === '/dashboard'
                ? location.pathname === '/dashboard'
                : location.pathname === item.path || location.pathname.startsWith(item.path + '/');

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={onClose}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '0.6rem 0.75rem', borderRadius: '8px', textDecoration: 'none',
                      fontSize: '0.875rem', fontWeight: isActive ? '600' : '500',
                      color: isActive ? '#7C5CFC' : '#5B5775',
                      backgroundColor: isActive ? '#F0ECFF' : 'transparent',
                      transition: 'all 0.12s ease',
                    }}
                    onMouseEnter={e => {
                      if (!isActive) { e.currentTarget.style.backgroundColor = '#FAF9FF'; e.currentTarget.style.color = '#17151F'; }
                    }}
                    onMouseLeave={e => {
                      if (!isActive) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#5B5775'; }
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                      <Icon size={17} color={isActive ? '#7C5CFC' : '#9CA3AF'} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span style={{
                        fontSize: '0.6rem', fontWeight: '700', backgroundColor: '#7C5CFC',
                        color: '#FFFFFF', padding: '0.1rem 0.38rem', borderRadius: '8px',
                      }}>
                        {item.badge}
                      </span>
                    )}
                    {isActive && (
                      <div style={{
                        width: '5px', height: '5px', borderRadius: '50%',
                        backgroundColor: '#7C5CFC', flexShrink: 0,
                      }} />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Profile Footer */}
        <div style={{
          padding: '0.85rem',
          borderTop: '1px solid #F3F0FF',
        }}>
          <div style={{
            backgroundColor: '#FAF9FF', borderRadius: '12px', padding: '0.9rem 1rem',
            display: 'flex', flexDirection: 'column', gap: '0.75rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{
                width: '34px', height: '34px', borderRadius: '50%', backgroundColor: '#7C5CFC',
                color: '#FFFFFF', fontWeight: '700', fontSize: '0.85rem', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {getInitials(user?.name)}
              </div>
              <div style={{ overflow: 'hidden', flex: 1 }}>
                <div style={{
                  fontSize: '0.83rem', fontWeight: '700', color: '#17151F',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {user?.name || 'User'}
                </div>
                <div style={{
                  fontSize: '0.72rem', color: '#9CA3AF',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {user?.email}
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              style={{
                width: '100%', backgroundColor: '#FFFFFF', color: '#EF4444',
                border: '1px solid #FCA5A5', padding: '0.45rem',
                borderRadius: '8px', fontSize: '0.78rem', fontWeight: '600',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
              }}
            >
              <LogOut size={13} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
