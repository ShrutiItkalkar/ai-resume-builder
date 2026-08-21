import { useState } from 'react';
import { apiClient } from '../../api/apiClient';

export default function AiGenerationSection({ resume, onApplyGeneratedContent }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedData, setGeneratedData] = useState(
    resume?.generatedContent?.[0]?.bulletPoints || null
  );
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const handleGenerate = async () => {
    if (!resume?.jobDescription) {
      alert('Please enter a Target Job Description in the Basic Details section first before generating AI content.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setSuccessMsg('');

    try {
      const response = await apiClient.post(`/resumes/${resume.id}/generate`, {
        jobDescription: resume.jobDescription,
      });
      const result = response.data.result || response.data.generatedContent?.bulletPoints;
      setGeneratedData(result);
      setSuccessMsg('AI resume tailoring completed!');
    } catch (err) {
      setError(err.message || 'Failed to generate AI content');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplySummary = () => {
    if (generatedData?.summary && onApplyGeneratedContent) {
      onApplyGeneratedContent({ summary: generatedData.summary });
      setSuccessMsg('Applied AI summary to resume!');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  const handleApplySkills = () => {
    if (Array.isArray(generatedData?.skills) && onApplyGeneratedContent) {
      const mergedSkills = Array.from(new Set([...(resume.skills || []), ...generatedData.skills]));
      onApplyGeneratedContent({ skills: mergedSkills });
      setSuccessMsg('Applied AI skills to resume!');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  return (
    <div style={{ backgroundColor: '#f0f9ff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #bae6fd', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ margin: 0, color: '#0369a1' }}>✨ AI Resume Tailor</h3>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#0284c7' }}>
            Generate job-aligned summary, skill recommendations, and ATS keywords tailored to your target job description.
          </p>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          style={{
            backgroundColor: '#0284c7',
            color: '#fff',
            border: 'none',
            padding: '0.6rem 1.2rem',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: isGenerating ? 'not-allowed' : 'pointer'
          }}
        >
          {isGenerating ? '✨ Tailoring...' : '✨ Generate AI Tailoring'}
        </button>
      </div>

      {error && (
        <div style={{ padding: '0.75rem', marginBottom: '1rem', backgroundColor: '#fef2f2', color: '#dc2626', borderRadius: '4px' }}>
          {error}
        </div>
      )}

      {successMsg && (
        <div style={{ padding: '0.75rem', marginBottom: '1rem', backgroundColor: '#f0fdf4', color: '#15803d', borderRadius: '4px' }}>
          {successMsg}
        </div>
      )}

      {generatedData && (
        <div style={{ backgroundColor: '#fff', padding: '1rem', borderRadius: '6px', border: '1px solid #e0f2fe', marginTop: '1rem' }}>
          <h4 style={{ marginTop: 0, color: '#0f172a' }}>Latest AI Tailored Output</h4>

          {/* Summary */}
          {generatedData.summary && (
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ color: '#334155' }}>Suggested Summary:</strong>
                <button onClick={handleApplySummary} style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem', backgroundColor: '#e0f2fe', color: '#0369a1', border: '1px solid #bae6fd', borderRadius: '4px', cursor: 'pointer' }}>
                  Apply Summary
                </button>
              </div>
              <p style={{ margin: '0.4rem 0', fontSize: '0.9rem', color: '#475569', backgroundColor: '#f8fafc', padding: '0.5rem', borderRadius: '4px' }}>
                {generatedData.summary}
              </p>
            </div>
          )}

          {/* Recommended Skills */}
          {Array.isArray(generatedData.skills) && generatedData.skills.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <strong style={{ color: '#334155' }}>Recommended Skills:</strong>
                <button onClick={handleApplySkills} style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem', backgroundColor: '#e0f2fe', color: '#0369a1', border: '1px solid #bae6fd', borderRadius: '4px', cursor: 'pointer' }}>
                  Apply Skills
                </button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {generatedData.skills.map((skill, idx) => (
                  <span key={idx} style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '0.2rem 0.5rem', borderRadius: '12px', fontSize: '0.8rem' }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ATS Keywords */}
          {Array.isArray(generatedData.atsKeywords) && generatedData.atsKeywords.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <strong style={{ color: '#334155', display: 'block', marginBottom: '0.4rem' }}>Extracted ATS Keywords:</strong>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {generatedData.atsKeywords.map((kw, idx) => (
                  <span key={idx} style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '0.2rem 0.5rem', borderRadius: '12px', fontSize: '0.8rem' }}>
                    🔑 {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {Array.isArray(generatedData.suggestions) && generatedData.suggestions.length > 0 && (
            <div>
              <strong style={{ color: '#334155' }}>Optimization Suggestions:</strong>
              <ul style={{ margin: '0.4rem 0 0 1.2rem', padding: 0, fontSize: '0.85rem', color: '#475569' }}>
                {generatedData.suggestions.map((sug, idx) => (
                  <li key={idx}>{sug}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
