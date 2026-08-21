import { useState } from 'react';

export default function EducationSection({ education = [], onAdd, onUpdate, onDelete, isLoading }) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form states
  const [institution, setInstitution] = useState('');
  const [degree, setDegree] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [error, setError] = useState('');

  const resetForm = () => {
    setInstitution('');
    setDegree('');
    setGraduationYear('');
    setError('');
    setIsAdding(false);
    setEditingId(null);
  };

  const startEdit = (edu) => {
    setEditingId(edu.id);
    setInstitution(edu.institution || '');
    setDegree(edu.degree || '');
    setGraduationYear(edu.graduationYear ? String(edu.graduationYear) : '');
    setIsAdding(false);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const gradYearNum = parseInt(graduationYear, 10);
    if (!institution.trim() || !degree.trim() || isNaN(gradYearNum)) {
      setError('Institution, degree, and a valid graduation year are required.');
      return;
    }
    setError('');

    const payload = {
      institution: institution.trim(),
      degree: degree.trim(),
      graduationYear: gradYearNum,
    };

    try {
      if (editingId) {
        await onUpdate(editingId, payload);
      } else {
        await onAdd(payload);
      }
      resetForm();
    } catch (err) {
      setError(err.message || 'Failed to save education entry');
    }
  };

  const handleDelete = async (eduId) => {
    if (!window.confirm('Delete this education entry?')) return;
    try {
      await onDelete(eduId);
    } catch (err) {
      alert(`Failed to delete education: ${err.message}`);
    }
  };

  return (
    <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0, color: '#1e293b' }}>Education</h3>
        {!isAdding && !editingId && (
          <button
            onClick={() => setIsAdding(true)}
            style={{ backgroundColor: '#059669', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer' }}
          >
            + Add Education
          </button>
        )}
      </div>

      {/* Existing list */}
      {education.length === 0 && !isAdding && (
        <p style={{ color: '#64748b', fontStyle: 'italic' }}>No education entries added yet.</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
        {education.map((edu) => (
          <div key={edu.id} style={{ border: '1px solid #e2e8f0', borderRadius: '6px', padding: '1rem', backgroundColor: editingId === edu.id ? '#f8fafc' : '#fff' }}>
            {editingId === edu.id ? (
              <form onSubmit={handleSubmit}>
                <h4 style={{ marginTop: 0 }}>Edit Education</h4>
                {error && <div style={{ color: 'red', marginBottom: '0.5rem' }}>{error}</div>}

                <div style={{ marginBottom: '0.5rem' }}>
                  <input placeholder="Institution / University *" value={institution} onChange={(e) => setInstitution(e.target.value)} required style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input placeholder="Degree / Major *" value={degree} onChange={(e) => setDegree(e.target.value)} required style={{ padding: '0.5rem' }} />
                  <input placeholder="Graduation Year *" type="number" value={graduationYear} onChange={(e) => setGraduationYear(e.target.value)} required style={{ padding: '0.5rem' }} />
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Update'}</button>
                  <button type="button" onClick={resetForm} disabled={isLoading}>Cancel</button>
                </div>
              </form>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: '0 0 0.25rem 0', color: '#0f172a' }}>{edu.degree}</h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#475569' }}>
                    {edu.institution} &bull; Class of {edu.graduationYear}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => startEdit(edu)} style={{ padding: '0.2rem 0.5rem', fontSize: '0.85rem' }}>Edit</button>
                  <button onClick={() => handleDelete(edu.id)} style={{ padding: '0.2rem 0.5rem', fontSize: '0.85rem', color: '#dc2626' }}>Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add New Form */}
      {isAdding && (
        <form onSubmit={handleSubmit} style={{ border: '1px solid #2563eb', borderRadius: '6px', padding: '1rem', backgroundColor: '#eff6ff' }}>
          <h4 style={{ marginTop: 0, color: '#1e40af' }}>Add Education</h4>
          {error && <div style={{ color: 'red', marginBottom: '0.5rem' }}>{error}</div>}

          <div style={{ marginBottom: '0.5rem' }}>
            <input placeholder="Institution / University (e.g. Stanford University) *" value={institution} onChange={(e) => setInstitution(e.target.value)} required style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <input placeholder="Degree (e.g. B.Tech Computer Science) *" value={degree} onChange={(e) => setDegree(e.target.value)} required style={{ padding: '0.5rem' }} />
            <input placeholder="Graduation Year (e.g. 2025) *" type="number" value={graduationYear} onChange={(e) => setGraduationYear(e.target.value)} required style={{ padding: '0.5rem' }} />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" disabled={isLoading} style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px' }}>
              {isLoading ? 'Adding...' : 'Save Education'}
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
