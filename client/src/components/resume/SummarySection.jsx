import { useState, useEffect } from 'react';
import { UserCheck, Save, Check } from 'lucide-react';

export default function SummarySection({ resume, onSave, isLoading }) {
  const [summary, setSummary] = useState(resume?.summary || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (resume?.summary !== undefined) {
      setSummary(resume.summary || '');
    }
  }, [resume?.summary]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSavedSuccess(false);
    try {
      await onSave({ summary: summary.trim() || null });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      alert(`Error saving summary: ${err.message}`);
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E9E6F2',
        padding: '2rem',
        boxShadow: '0 2px 4px rgba(23, 21, 31, 0.03)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid #F8F7FC', paddingBottom: '1rem' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#F3F0FF', color: '#7C5CFC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <UserCheck size={20} />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '700', color: '#17151F' }}>
            Professional Summary
          </h3>
          <p style={{ margin: '0.1rem 0 0 0', fontSize: '0.8rem', color: '#6B6875' }}>
            Write a 2-4 sentence high-impact elevator pitch highlighting your core engineering strengths.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div style={{ backgroundColor: '#F0FDF4', color: '#22C55E', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>
          <Check size={16} /> Professional summary saved successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#17151F', marginBottom: '0.5rem' }} htmlFor="summary-text">
            Summary / Profile Statement
          </label>
          <textarea
            id="summary-text"
            rows={5}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Driven Software Engineer with experience building scalable web applications with React, Node.js, and PostgreSQL. Demonstrated track record of optimizing application performance and delivering robust product features..."
            disabled={isLoading}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
          <button type="submit" className="btn-primary" disabled={isLoading}>
            <Save size={16} />
            {isLoading ? 'Saving...' : 'Save Summary'}
          </button>
        </div>
      </form>
    </div>
  );
}
