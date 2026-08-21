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
  FileCheck,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'My Resumes', path: '/resumes', icon: FileText },
  { label: 'AI Tools', path: '/ai-tools', icon: Sparkles, badge: 'NEW' },
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
            backgroundColor: 'rgba(36, 34, 31, 0.4)',
            zIndex: 40, backdropFilter: 'blur(2px)',
          }}
          className="md:hidden"
        />
      )}

      <aside
        style={{
          width: '250px',
          backgroundColor: 'var(--sidebar-bg)',
          borderRight: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          position: 'fixed',
          top: 0, left: 0,
          zIndex: 50,
          transition: 'transform 0.22s ease-in-out, background-color 0.2s ease, border-color 0.2s ease',
        }}
        className={`app-sidebar ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div style={{
          padding: '1.5rem 1.4rem 1.2rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <div style={{
              width: '38px', height: '38px', borderRadius: '11px',
              backgroundColor: '#3D2E21',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#F7F3EA', boxShadow: '0 3px 8px rgba(61,46,33,0.25)',
            }}>
              <FileCheck size={20} />
            </div>
            <div>
              <span style={{
                fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)',
                letterSpacing: '-0.03em', lineHeight: '1.1',
              }}>
                Resume<span style={{ color: '#8B7355' }}>AI</span>
              </span>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: '500', marginTop: '0.1rem' }}>
                Smart Resume Builder
              </div>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="md:hidden"
            style={{ background: 'none', border: 'none', padding: '0.2rem', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav style={{ padding: '1.25rem 0.9rem', flex: 1, overflowY: 'auto' }}>
          <div style={{
            fontSize: '0.67rem', fontWeight: '700', textTransform: 'uppercase',
            letterSpacing: '0.08em', color: 'var(--text-muted)',
            padding: '0 0.65rem 0.65rem',
          }}>
            Main Menu
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
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
                      padding: '0.65rem 0.85rem', borderRadius: '10px', textDecoration: 'none',
                      fontSize: '0.875rem', fontWeight: isActive ? '700' : '500',
                      color: isActive ? '#3D2E21' : 'var(--text-secondary)',
                      backgroundColor: isActive ? '#E9DFCF' : 'transparent',
                      transition: 'all 0.15s ease',
                      height: '46px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Icon size={18} color={isActive ? '#3D2E21' : 'var(--text-muted)'} />
                      </div>
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span style={{
                        fontSize: '0.6rem', fontWeight: '700', backgroundColor: '#E5DED2',
                        color: '#5C4A38', padding: '0.15rem 0.45rem', borderRadius: '6px',
                        textTransform: 'uppercase', letterSpacing: '0.05em',
                      }}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Profile Footer */}
        <div style={{
          padding: '0.9rem',
          borderTop: '1px solid var(--border-color)',
        }}>
          <div style={{
            backgroundColor: 'var(--card-bg)', borderRadius: '14px', padding: '0.9rem 1rem',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex', flexDirection: 'column', gap: '0.75rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', overflow: 'hidden' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#3D2E21',
                color: '#FFFFFF', fontWeight: '700', fontSize: '0.85rem', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {getInitials(user?.name)}
              </div>
              <div style={{ overflow: 'hidden', flex: 1 }}>
                <div style={{
                  fontSize: '0.83rem', fontWeight: '700', color: 'var(--text-main)',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {user?.name || 'John Doe'}
                </div>
                <div style={{
                  fontSize: '0.72rem', color: 'var(--text-muted)',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {user?.email || 'john@example.com'}
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              style={{
                width: '100%', backgroundColor: 'var(--card-bg)', color: '#3D2E21',
                border: '1px solid var(--border-color)', padding: '0.45rem',
                borderRadius: '8px', fontSize: '0.78rem', fontWeight: '600',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                transition: 'all 0.15s ease',
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
