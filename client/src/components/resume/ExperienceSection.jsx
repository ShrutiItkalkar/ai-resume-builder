import { useState } from 'react';

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
    <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0, color: '#1e293b' }}>Work Experience</h3>
        {!isAdding && !editingId && (
          <button
            onClick={() => setIsAdding(true)}
            style={{ backgroundColor: '#059669', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer' }}
          >
            + Add Experience
          </button>
        )}
      </div>

      {/* Existing list */}
      {experiences.length === 0 && !isAdding && (
        <p style={{ color: '#64748b', fontStyle: 'italic' }}>No work experience added yet.</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
        {experiences.map((exp) => (
          <div key={exp.id} style={{ border: '1px solid #e2e8f0', borderRadius: '6px', padding: '1rem', backgroundColor: editingId === exp.id ? '#f8fafc' : '#fff' }}>
            {editingId === exp.id ? (
              <form onSubmit={handleSubmit}>
                <h4 style={{ marginTop: 0 }}>Edit Experience</h4>
                {error && <div style={{ color: 'red', marginBottom: '0.5rem' }}>{error}</div>}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input placeholder="Company *" value={company} onChange={(e) => setCompany(e.target.value)} required />
                  <input placeholder="Role / Title *" value={role} onChange={(e) => setRole(e.target.value)} required />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input placeholder="Start Date *" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                  <input placeholder="End Date (or Present)" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
                <textarea rows={3} placeholder="Description..." value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: '100%', marginBottom: '0.5rem', boxSizing: 'border-box' }} />

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Update'}</button>
                  <button type="button" onClick={resetForm} disabled={isLoading}>Cancel</button>
                </div>
              </form>
            ) : (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.25rem 0', color: '#0f172a' }}>{exp.role} <span style={{ fontWeight: 'normal', color: '#475569' }}>at {exp.company}</span></h4>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                      {exp.startDate} - {exp.endDate || 'Present'}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => startEdit(exp)} style={{ padding: '0.2rem 0.5rem', fontSize: '0.85rem' }}>Edit</button>
                    <button onClick={() => handleDelete(exp.id)} style={{ padding: '0.2rem 0.5rem', fontSize: '0.85rem', color: '#dc2626' }}>Delete</button>
                  </div>
                </div>
                {exp.description && (
                  <p style={{ marginTop: '0.5rem', marginBottom: 0, fontSize: '0.9rem', whiteSpace: 'pre-line', color: '#334155' }}>
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
        <form onSubmit={handleSubmit} style={{ border: '1px solid #2563eb', borderRadius: '6px', padding: '1rem', backgroundColor: '#eff6ff' }}>
          <h4 style={{ marginTop: 0, color: '#1e40af' }}>Add Work Experience</h4>
          {error && <div style={{ color: 'red', marginBottom: '0.5rem' }}>{error}</div>}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <input placeholder="Company *" value={company} onChange={(e) => setCompany(e.target.value)} required style={{ padding: '0.5rem' }} />
            <input placeholder="Role / Title *" value={role} onChange={(e) => setRole(e.target.value)} required style={{ padding: '0.5rem' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <input placeholder="Start Date (e.g. Jan 2023) *" value={startDate} onChange={(e) => setStartDate(e.target.value)} required style={{ padding: '0.5rem' }} />
            <input placeholder="End Date (e.g. Present)" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ padding: '0.5rem' }} />
          </div>
          <textarea rows={3} placeholder="Key achievements and duties..." value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem', boxSizing: 'border-box' }} />

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" disabled={isLoading} style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px' }}>
              {isLoading ? 'Adding...' : 'Save Experience'}
            </button>
            <button type="button" onClick={resetForm} disabled={isLoading} style={{ padding: '0.5rem 1rem' }}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
