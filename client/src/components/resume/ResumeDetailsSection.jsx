import { useState } from 'react';
import { FileText, Save, Check } from 'lucide-react';

export default function ResumeDetailsSection({ resume, onSave, isLoading }) {
  const [title, setTitle] = useState(resume?.title || '');
  const [jobDescription, setJobDescription] = useState(resume?.jobDescription || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSavedSuccess(false);
    try {
      await onSave({ title: title.trim(), jobDescription: jobDescription.trim() || null });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      alert(`Error saving details: ${err.message}`);
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
          <FileText size={20} />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '700', color: '#17151F' }}>
            Basic Details & Job Description
          </h3>
          <p style={{ margin: '0.1rem 0 0 0', fontSize: '0.8rem', color: '#6B6875' }}>
            Enter your resume title and target job description for AI tailoring.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div style={{ backgroundColor: '#F0FDF4', color: '#22C55E', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>
          <Check size={16} /> Basic details saved successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#17151F', marginBottom: '0.5rem' }} htmlFor="resume-title">
            Resume Title *
          </label>
          <input
            id="resume-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Senior Frontend Engineer - Target Tech Corp"
            disabled={isLoading}
            required
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#17151F', marginBottom: '0.5rem' }} htmlFor="target-job-desc">
            Target Job Description (Optional — Used by AI Tailor)
          </label>
          <textarea
            id="target-job-desc"
            rows={6}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description you are applying for here. AI will extract ATS keywords and tailor your resume for this role..."
            disabled={isLoading}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
          <button type="submit" className="btn-primary" disabled={isLoading}>
            <Save size={16} />
            {isLoading ? 'Saving...' : 'Save Basic Details'}
          </button>
        </div>
      </form>
    </div>
  );
}
