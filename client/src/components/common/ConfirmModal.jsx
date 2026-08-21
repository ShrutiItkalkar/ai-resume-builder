import { AlertTriangle } from 'lucide-react';

export default function ConfirmModal({
  isOpen, title, message, onConfirm, onCancel, confirmText = 'Delete', isDanger = true,
}) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      backgroundColor: 'rgba(15, 12, 28, 0.55)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backdropFilter: 'blur(3px)',
      padding: '1rem',
    }}>
      <div style={{
        backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '2rem',
        maxWidth: '420px', width: '100%',
        boxShadow: '0 20px 60px rgba(23,21,31,0.2)',
        animation: 'modalIn 0.18s ease',
      }}>
        {/* Icon */}
        {isDanger && (
          <div style={{
            width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#FEF2F2',
            color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '1.25rem',
          }}>
            <AlertTriangle size={22} />
          </div>
        )}

        <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem', fontWeight: '700', color: '#17151F' }}>
          {title}
        </h3>
        <p style={{ margin: '0 0 1.75rem', fontSize: '0.875rem', color: '#6B6875', lineHeight: '1.5' }}>
          {message}
        </p>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button className="btn-secondary" onClick={onCancel} style={{ padding: '0.6rem 1.2rem' }}>
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={isDanger ? 'btn-danger' : 'btn-primary'}
            style={{ padding: '0.6rem 1.2rem' }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
