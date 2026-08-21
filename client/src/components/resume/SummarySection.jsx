import { useState, useEffect } from 'react';

export default function SummarySection({ resume, onSave, isLoading }) {
  const [summary, setSummary] = useState(resume?.summary || '');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (resume?.summary !== undefined) {
      setSummary(resume.summary || '');
    }
  }, [resume?.summary]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await onSave({ summary: summary.trim() || null });
      setMessage('Summary saved successfully.');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert(`Error saving summary: ${err.message}`);
    }
  };

  return (
    <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
      <h3 style={{ marginTop: 0, marginBottom: '1rem', color: '#1e293b' }}>Professional Summary</h3>
      
      {message && <div style={{ padding: '0.5rem', marginBottom: '1rem', background: '#f0fdf4', color: '#15803d', borderRadius: '4px' }}>{message}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }} htmlFor="summary-text">
            Summary / Profile Statement
          </label>
          <textarea
            id="summary-text"
            rows={4}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Driven Software Engineering student with experience building scalable full-stack web applications..."
            style={{ width: '100%', padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '4px', boxSizing: 'border-box' }}
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '4px', cursor: isLoading ? 'not-allowed' : 'pointer' }}
        >
          {isLoading ? 'Saving...' : 'Save Summary'}
        </button>
      </form>
    </div>
  );
}
