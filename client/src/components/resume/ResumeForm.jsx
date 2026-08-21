import { useState } from 'react';

export default function ResumeForm({ initialData = {}, onSubmit, onCancel, isLoading = false }) {
  const [title, setTitle] = useState(initialData.title || '');
  const [jobDescription, setJobDescription] = useState(initialData.jobDescription || '');
  const [skillsText, setSkillsText] = useState(
    Array.isArray(initialData.skills) ? initialData.skills.join(', ') : ''
  );
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Resume title is required');
      return;
    }
    setError('');

    // Parse comma-separated skills into an array of strings
    const skillsArray = skillsText
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    onSubmit({
      title: title.trim(),
      jobDescription: jobDescription.trim() || undefined,
      skills: skillsArray,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="resume-form">
      {error && <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      
      <div className="form-group">
        <label htmlFor="title">Resume Title *</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Full Stack Developer Resume"
          disabled={isLoading}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="jobDescription">Target Job Description (Optional)</label>
        <textarea
          id="jobDescription"
          rows={4}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste job description here to tailor resume..."
          disabled={isLoading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="skills">Skills (Comma-separated)</label>
        <input
          id="skills"
          type="text"
          value={skillsText}
          onChange={(e) => setSkillsText(e.target.value)}
          placeholder="React, Node.js, PostgreSQL, TypeScript"
          disabled={isLoading}
        />
      </div>

      <div className="form-actions" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : initialData.id ? 'Update Resume' : 'Create Resume'}
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
