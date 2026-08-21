import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Bell, Shield, Save, Check } from 'lucide-react';

function Section({ title, description, icon: Icon, children }) {
  return (
    <div style={{
      backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E9E6F2',
      overflow: 'hidden', boxShadow: '0 2px 6px rgba(23,21,31,0.04)',
    }}>
      <div style={{
        padding: '1.25rem 1.75rem', borderBottom: '1px solid #F3F4F6',
        display: 'flex', alignItems: 'center', gap: '0.75rem',
      }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '9px', backgroundColor: '#F3F0FF',
          color: '#7C5CFC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon size={18} />
        </div>
        <div>
          <div style={{ fontWeight: '700', color: '#17151F', fontSize: '0.95rem' }}>{title}</div>
          {description && <div style={{ color: '#6B6875', fontSize: '0.8rem', marginTop: '0.1rem' }}>{description}</div>}
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
      <label htmlFor={id} style={{ fontSize: '0.83rem', fontWeight: '600', color: '#4B4855' }}>
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
        <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#17151F' }}>{label}</div>
        {description && <div style={{ fontSize: '0.78rem', color: '#6B6875', marginTop: '0.2rem' }}>{description}</div>}
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
    // In a real implementation this would call the API
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handlePasswordSave = (e) => {
    e.preventDefault();
    if (newPwd !== confirmPwd) {
      alert('Passwords do not match.');
      return;
    }
    alert('Password updated! (Demo — no backend call made)');
    setCurrentPwd(''); setNewPwd(''); setConfirmPwd('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '700px' }}>

      {/* Profile */}
      <Section title="Profile" description="Update your personal information" icon={User}>
        <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Avatar */}
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
              <div style={{ fontWeight: '700', color: '#17151F', fontSize: '0.9rem' }}>{name || 'Your Name'}</div>
              <div style={{ color: '#6B6875', fontSize: '0.8rem' }}>{email}</div>
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
          <div style={{ borderTop: '1px solid #F3F4F6' }} />
          <Toggle
            label="AI Suggestions"
            description="Get real-time AI-powered improvement tips while editing"
            checked={aiSuggestions}
            onChange={setAiSuggestions}
          />
          <div style={{ borderTop: '1px solid #F3F4F6' }} />
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
        backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '16px', padding: '1.5rem 1.75rem',
      }}>
        <h4 style={{ margin: '0 0 0.4rem 0', fontWeight: '700', color: '#EF4444', fontSize: '0.95rem' }}>
          Danger Zone
        </h4>
        <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.83rem', color: '#6B6875' }}>
          Deleting your account is permanent and cannot be undone.
        </p>
        <button className="btn-danger" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}>
          Delete Account
        </button>
      </div>
    </div>
  );
}
