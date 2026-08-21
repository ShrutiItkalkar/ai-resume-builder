export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Delete', isDanger = true }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '1.5rem',
        maxWidth: '400px',
        width: '90%',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      }}>
        <h3 style={{ marginTop: 0, color: '#0f172a' }}>{title}</h3>
        <p style={{ color: '#475569', fontSize: '0.95rem', marginBottom: '1.5rem' }}>{message}</p>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              backgroundColor: '#fff',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: isDanger ? '#dc2626' : '#2563eb',
              color: '#fff',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
