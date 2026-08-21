import { useState } from 'react';
import { Briefcase, Plus, Edit2, Trash2, Save, X } from 'lucide-react';

export default function ExperienceSection({ experiences = [], onAdd, onUpdate, onDelete, isLoading }) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form states
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const resetForm = () => {
    setCompany('');
    setRole('');
    setStartDate('');
    setEndDate('');
    setDescription('');
    setError('');
    setIsAdding(false);
    setEditingId(null);
  };

  const startEdit = (exp) => {
    setEditingId(exp.id);
    setCompany(exp.company || '');
    setRole(exp.role || '');
    setStartDate(exp.startDate || '');
    setEndDate(exp.endDate || '');
    setDescription(exp.description || '');
    setIsAdding(false);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!company.trim() || !role.trim() || !startDate.trim()) {
      setError('Company, role, and start date are required.');
      return;
    }
    setError('');

    const payload = {
      company: company.trim(),
      role: role.trim(),
      startDate: startDate.trim(),
      endDate: endDate.trim() || null,
      description: description.trim() || null,
    };

    try {
      if (editingId) {
        await onUpdate(editingId, payload);
      } else {
        await onAdd(payload);
      }
      resetForm();
    } catch (err) {
      setError(err.message || 'Failed to save experience');
    }
  };

  const handleDelete = async (expId) => {
    if (!window.confirm('Delete this experience entry?')) return;
    try {
      await onDelete(expId);
    } catch (err) {
      alert(`Failed to delete experience: ${err.message}`);
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #F8F7FC', paddingBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#F3F0FF', color: '#7C5CFC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Briefcase size={20} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '700', color: '#17151F' }}>
              Work Experience
            </h3>
            <p style={{ margin: '0.1rem 0 0 0', fontSize: '0.8rem', color: '#6B6875' }}>
              Highlight your previous software engineering roles, internships, and key achievements.
            </p>
          </div>
        </div>

        {!isAdding && !editingId && (
          <button onClick={() => setIsAdding(true)} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            <Plus size={16} /> Add Experience
          </button>
        )}
      </div>

      {/* Existing list */}
      {experiences.length === 0 && !isAdding && (
        <p style={{ color: '#9CA3AF', fontStyle: 'italic', fontSize: '0.9rem' }}>No work experience entries added yet.</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
        {experiences.map((exp) => (
          <div
            key={exp.id}
            style={{
              border: '1px solid #E9E6F2',
              borderRadius: '12px',
              padding: '1.25rem',
              backgroundColor: editingId === exp.id ? '#F8F7FC' : '#FFFFFF',
            }}
          >
            {editingId === exp.id ? (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#17151F' }}>Edit Experience Entry</h4>
                {error && <div style={{ color: '#EF4444', fontSize: '0.85rem' }}>{error}</div>}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.3rem' }}>Company *</label>
                    <input value={company} onChange={(e) => setCompany(e.target.value)} required placeholder="e.g. Acme Tech" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.3rem' }}>Role / Title *</label>
                    <input value={role} onChange={(e) => setRole(e.target.value)} required placeholder="e.g. Software Engineer Intern" />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.3rem' }}>Start Date *</label>
                    <input value={startDate} onChange={(e) => setStartDate(e.target.value)} required placeholder="e.g. Jan 2024" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.3rem' }}>End Date</label>
                    <input value={endDate} onChange={(e) => setEndDate(e.target.value)} placeholder="e.g. Jun 2024 (or Present)" />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.3rem' }}>Description & Key Achievements</label>
                  <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe key metrics, tech stack, and responsibilities..." />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                  <button type="button" onClick={resetForm} className="btn-secondary">Cancel</button>
                  <button type="submit" className="btn-primary" disabled={isLoading}>{isLoading ? 'Saving...' : 'Update Entry'}</button>
                </div>
              </form>
            ) : (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem', color: '#17151F' }}>
                      {exp.role} <span style={{ fontWeight: '500', color: '#6B6875' }}>at {exp.company}</span>
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#7C5CFC', fontWeight: '600' }}>
                      {exp.startDate} &ndash; {exp.endDate || 'Present'}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button onClick={() => startEdit(exp)} className="btn-secondary" style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}>
                      <Edit2 size={13} /> Edit
                    </button>
                    <button onClick={() => handleDelete(exp.id)} className="btn-danger" style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}>
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </div>

                {exp.description && (
                  <p style={{ marginTop: '0.65rem', marginBottom: 0, fontSize: '0.875rem', lineHeight: '1.5', color: '#4B4855', whiteSpace: 'pre-line' }}>
                    {exp.description}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add New Form */}
      {isAdding && (
        <form onSubmit={handleSubmit} style={{ border: '1px solid #7C5CFC', borderRadius: '12px', padding: '1.25rem', backgroundColor: '#F3F0FF' }}>
          <h4 style={{ margin: '0 0 1rem 0', color: '#7C5CFC' }}>Add Work Experience</h4>
          {error && <div style={{ color: '#EF4444', marginBottom: '0.75rem', fontSize: '0.85rem' }}>{error}</div>}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.3rem' }}>Company *</label>
              <input value={company} onChange={(e) => setCompany(e.target.value)} required placeholder="e.g. Acme Tech" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.3rem' }}>Role / Title *</label>
              <input value={role} onChange={(e) => setRole(e.target.value)} required placeholder="e.g. Software Engineer Intern" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.3rem' }}>Start Date *</label>
              <input value={startDate} onChange={(e) => setStartDate(e.target.value)} required placeholder="e.g. Jan 2024" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.3rem' }}>End Date</label>
              <input value={endDate} onChange={(e) => setEndDate(e.target.value)} placeholder="e.g. Jun 2024 (or Present)" />
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.3rem' }}>Description & Key Achievements</label>
            <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe key metrics, tech stack, and responsibilities..." />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
            <button type="button" onClick={resetForm} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary" disabled={isLoading}>{isLoading ? 'Adding...' : 'Save Experience'}</button>
          </div>
        </form>
      )}
    </div>
  );
}
