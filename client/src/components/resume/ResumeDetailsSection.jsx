import { useState } from 'react';

export default function ResumeDetailsSection({ resume, onSave, isLoading }) {
  const [title, setTitle] = useState(resume?.title || '');
  const [jobDescription, setJobDescription] = useState(resume?.jobDescription || '');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setMessage('');
    try {
      await onSave({ title: title.trim(), jobDescription: jobDescription.trim() || null });
      setMessage('Resume details saved successfully.');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert(`Error saving details: ${err.message}`);
    }
  };

  return (
    <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
      <h3 style={{ marginTop: 0, marginBottom: '1rem', color: '#1e293b' }}>Basic Details & Job Description</h3>
      
      {message && <div style={{ padding: '0.5rem', marginBottom: '1rem', background: '#f0fdf4', color: '#15803d', borderRadius: '4px' }}>{message}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }} htmlFor="resume-title">Resume Title *</label>
          <input
            id="resume-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Senior Frontend Engineer - Tech Corp"
            style={{ width: '100%', padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '4px', boxSizing: 'border-box' }}
            disabled={isLoading}
            required
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }} htmlFor="target-job-desc">Target Job Description (for AI Tailoring)</label>
          <textarea
            id="target-job-desc"
            rows={5}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description you are applying for here..."
            style={{ width: '100%', padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '4px', boxSizing: 'border-box' }}
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '4px', cursor: isLoading ? 'not-allowed' : 'pointer' }}
        >
          {isLoading ? 'Saving...' : 'Save Basic Details'}
        </button>
      </form>
    </div>
  );
}
