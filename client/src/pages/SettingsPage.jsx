import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { User, Bell, Shield, Save, Check, Sun, Moon } from 'lucide-react';

function Section({ title, description, icon: Icon, children }) {
  return (
    <div style={{
      backgroundColor: 'var(--card-bg)', borderRadius: '16px', border: '1px solid var(--border-color)',
      overflow: 'hidden', boxShadow: 'var(--shadow-sm)',
    }}>
      <div style={{
        padding: '1.25rem 1.75rem', borderBottom: '1px solid var(--border-color)',
        display: 'flex', alignItems: 'center', gap: '0.75rem',
      }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '9px', backgroundColor: 'var(--primary-light)',
          color: '#7C5CFC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon size={18} />
        </div>
        <div>
          <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '0.95rem' }}>{title}</div>
          {description && <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.1rem' }}>{description}</div>}
        </div>
      </div>
      <div style={{ padding: '1.75rem' }}>
        {children}
      </div>
    </div>
  );
}

function FormField({ label, id, type = 'text', value, onChange, placeholder, disabled }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      <label htmlFor={id} style={{ fontSize: '0.83rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
        {label}
      </label>
      <input
        id={id} type={type} value={value} onChange={onChange}
        placeholder={placeholder} disabled={disabled}
        style={{ maxWidth: '420px' }}
      />
    </div>
  );
}

function Toggle({ label, description, checked, onChange }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBlock: '0.85rem' }}>
      <div>
        <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-main)' }}>{label}</div>
        {description && <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{description}</div>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        style={{
          width: '44px', height: '24px', borderRadius: '12px', border: 'none',
          backgroundColor: checked ? '#7C5CFC' : '#D1D5DB',
          cursor: 'pointer', position: 'relative', transition: 'background-color 0.2s ease', flexShrink: 0,
          padding: 0,
        }}
      >
        <div style={{
          width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#FFFFFF',
          position: 'absolute', top: '3px',
          left: checked ? '23px' : '3px',
          transition: 'left 0.2s ease',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }} />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [saved, setSaved] = useState(false);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [aiSuggestions, setAiSuggestions] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');

  const handleProfileSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handlePasswordSave = (e) => {
    e.preventDefault();
    if (newPwd !== confirmPwd) {
      alert('Passwords do not match.');
      return;
    }
    alert('Password updated!');
    setCurrentPwd(''); setNewPwd(''); setConfirmPwd('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '700px' }}>

      {/* Theme Appearance Section */}
      <Section title="Appearance & Theme" description="Customize how ResumeAI looks on your device" icon={theme === 'dark' ? Moon : Sun}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-main)' }}>
              Current Theme: <span style={{ color: '#7C5CFC', textTransform: 'capitalize' }}>{theme} Mode</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Toggle between dark mode and light mode across the app
            </div>
          </div>

          <button
            onClick={toggleTheme}
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem' }}
          >
            {theme === 'dark' ? (
              <>
                <Sun size={16} /> Switch to Light Mode
              </>
            ) : (
              <>
                <Moon size={16} /> Switch to Dark Mode
              </>
            )}
          </button>
        </div>
      </Section>

      {/* Profile */}
      <Section title="Profile" description="Update your personal information" icon={User}>
        <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <div style={{
              width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#7C5CFC',
              color: '#FFFFFF', fontWeight: '800', fontSize: '1.35rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(124,92,252,0.3)',
            }}>
              {(name || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '0.9rem' }}>{name || 'Your Name'}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{email}</div>
            </div>
          </div>

          <FormField label="Full Name" id="name" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" />
          <FormField label="Email Address" id="email" type="email" value={email} placeholder="you@example.com" disabled />

          <div>
            <button type="submit" className="btn-primary" style={{ padding: '0.65rem 1.25rem', fontSize: '0.875rem' }}>
              {saved ? <><Check size={15} /> Saved!</> : <><Save size={15} /> Save Changes</>}
            </button>
          </div>
        </form>
      </Section>

      {/* Preferences */}
      <Section title="Preferences" description="Manage notifications and AI settings" icon={Bell}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Toggle
            label="Email Notifications"
            description="Receive updates about your resume activity"
            checked={emailNotifs}
            onChange={setEmailNotifs}
          />
          <div style={{ borderTop: '1px solid var(--border-color)' }} />
          <Toggle
            label="AI Suggestions"
            description="Get real-time AI-powered improvement tips while editing"
            checked={aiSuggestions}
            onChange={setAiSuggestions}
          />
          <div style={{ borderTop: '1px solid var(--border-color)' }} />
          <Toggle
            label="Weekly Digest"
            description="Receive a weekly summary of your resume performance"
            checked={weeklyDigest}
            onChange={setWeeklyDigest}
          />
        </div>
      </Section>

      {/* Security */}
      <Section title="Security" description="Change your password" icon={Shield}>
        <form onSubmit={handlePasswordSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <FormField
            label="Current Password" id="currentPwd" type="password"
            value={currentPwd} onChange={e => setCurrentPwd(e.target.value)}
            placeholder="••••••••"
          />
          <FormField
            label="New Password" id="newPwd" type="password"
            value={newPwd} onChange={e => setNewPwd(e.target.value)}
            placeholder="••••••••"
          />
          <FormField
            label="Confirm New Password" id="confirmPwd" type="password"
            value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)}
            placeholder="••••••••"
          />
          <div>
            <button type="submit" className="btn-secondary" style={{ padding: '0.65rem 1.25rem', fontSize: '0.875rem' }}>
              <Shield size={15} />
              Update Password
            </button>
          </div>
        </form>
      </Section>

      {/* Danger Zone */}
      <div style={{
        backgroundColor: 'var(--card-bg)', border: '1px solid #FCA5A5', borderRadius: '16px', padding: '1.5rem 1.75rem',
      }}>
        <h4 style={{ margin: '0 0 0.4rem 0', fontWeight: '700', color: '#EF4444', fontSize: '0.95rem' }}>
          Danger Zone
        </h4>
        <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.83rem', color: 'var(--text-muted)' }}>
          Deleting your account is permanent and cannot be undone.
        </p>
        <button className="btn-danger" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}>
          Delete Account
        </button>
      </div>
    </div>
  );
}
