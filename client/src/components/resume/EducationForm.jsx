import { useState } from 'react';

export default function EducationForm({ onSubmit, onCancel, isLoading = false }) {
  const [institution, setInstitution] = useState('');
  const [degree, setDegree] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const gradYearNum = parseInt(graduationYear, 10);
    if (!institution.trim() || !degree.trim() || isNaN(gradYearNum)) {
      setError('Institution, degree, and a valid graduation year are required.');
      return;
    }
    setError('');

    onSubmit({
      institution: institution.trim(),
      degree: degree.trim(),
      graduationYear: gradYearNum,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="education-form">
      {error && <div className="error-message" style={{ color: 'red', marginBottom: '0.5rem' }}>{error}</div>}

      <div className="form-group">
        <label htmlFor="institution">Institution / University *</label>
        <input
          id="institution"
          type="text"
          value={institution}
          onChange={(e) => setInstitution(e.target.value)}
          placeholder="e.g. Stanford University"
          disabled={isLoading}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="degree">Degree / Major *</label>
        <input
          id="degree"
          type="text"
          value={degree}
          onChange={(e) => setDegree(e.target.value)}
          placeholder="e.g. B.Tech Computer Science"
          disabled={isLoading}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="graduationYear">Graduation Year *</label>
        <input
          id="graduationYear"
          type="number"
          value={graduationYear}
          onChange={(e) => setGraduationYear(e.target.value)}
          placeholder="e.g. 2025"
          disabled={isLoading}
          required
        />
      </div>

      <div className="form-actions" style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Add Education'}
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
