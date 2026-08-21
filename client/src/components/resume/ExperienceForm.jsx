import { useState } from 'react';

export default function ExperienceForm({ onSubmit, onCancel, isLoading = false }) {
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!company.trim() || !role.trim() || !startDate.trim()) {
      setError('Company, role, and start date are required.');
      return;
    }
    setError('');

    onSubmit({
      company: company.trim(),
      role: role.trim(),
      startDate: startDate.trim(),
      endDate: endDate.trim() || null,
      description: description.trim() || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="experience-form">
      {error && <div className="error-message" style={{ color: 'red', marginBottom: '0.5rem' }}>{error}</div>}

      <div className="form-group">
        <label htmlFor="company">Company *</label>
        <input
          id="company"
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="e.g. Acme Corp"
          disabled={isLoading}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="role">Role / Job Title *</label>
        <input
          id="role"
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="e.g. Software Engineer"
          disabled={isLoading}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="startDate">Start Date *</label>
        <input
          id="startDate"
          type="text"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          placeholder="e.g. Jan 2023"
          disabled={isLoading}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="endDate">End Date (Leave blank if current)</label>
        <input
          id="endDate"
          type="text"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          placeholder="e.g. Present or Dec 2024"
          disabled={isLoading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description / Achievements</label>
        <textarea
          id="description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Key achievements, responsibilities, tech used..."
          disabled={isLoading}
        />
      </div>

      <div className="form-actions" style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Add Experience'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} disabled={isLoading}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
