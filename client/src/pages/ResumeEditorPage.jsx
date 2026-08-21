import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../api/apiClient';
import ResumeDetailsSection from '../components/resume/ResumeDetailsSection';
import SummarySection from '../components/resume/SummarySection';
import SkillsSection from '../components/resume/SkillsSection';
import ExperienceSection from '../components/resume/ExperienceSection';
import EducationSection from '../components/resume/EducationSection';
import AiGenerationSection from '../components/resume/AiGenerationSection';
import ResumePreview from '../components/resume/ResumePreview';
import ResumeForm from '../components/resume/ResumeForm';

export default function ResumeEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id || id === 'new';

  const [resume, setResume] = useState(null);
  const [activeTab, setActiveTab] = useState('edit');
  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchResume = async () => {
    if (isNew) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`/resumes/${id}`);
      setResume(response.data);
    } catch (err) {
      setError(err.message || 'Failed to load resume details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResume();
  }, [id]);

  // Save main resume fields (title, summary, jobDescription, skills)
  const handleSaveResumeFields = async (updatedFields) => {
    setIsSaving(true);
    try {
      const response = await apiClient.put(`/resumes/${id}`, updatedFields);
      setResume((prev) => ({ ...prev, ...response.data }));
      return response.data;
    } finally {
      setIsSaving(false);
    }
  };

  // Experience handlers
  const handleAddExperience = async (expData) => {
    setIsSaving(true);
    try {
      const response = await apiClient.post(`/resumes/${id}/experiences`, expData);
      setResume((prev) => ({
        ...prev,
        experiences: [...(prev.experiences || []), response.data],
      }));
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateExperience = async (expId, expData) => {
    setIsSaving(true);
    try {
      const response = await apiClient.put(`/resumes/${id}/experiences/${expId}`, expData);
      setResume((prev) => ({
        ...prev,
        experiences: (prev.experiences || []).map((e) => (e.id === expId ? response.data : e)),
      }));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteExperience = async (expId) => {
    setIsSaving(true);
    try {
      await apiClient.delete(`/resumes/${id}/experiences/${expId}`);
      setResume((prev) => ({
        ...prev,
        experiences: (prev.experiences || []).filter((e) => e.id !== expId),
      }));
    } finally {
      setIsSaving(false);
    }
  };

  // Education handlers
  const handleAddEducation = async (eduData) => {
    setIsSaving(true);
    try {
      const response = await apiClient.post(`/resumes/${id}/education`, eduData);
      setResume((prev) => ({
        ...prev,
        education: [...(prev.education || []), response.data],
      }));
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateEducation = async (eduId, eduData) => {
    setIsSaving(true);
    try {
      const response = await apiClient.put(`/resumes/${id}/education/${eduId}`, eduData);
      setResume((prev) => ({
        ...prev,
        education: (prev.education || []).map((e) => (e.id === eduId ? response.data : e)),
      }));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteEducation = async (eduId) => {
    setIsSaving(true);
    try {
      await apiClient.delete(`/resumes/${id}/education/${eduId}`);
      setResume((prev) => ({
        ...prev,
        education: (prev.education || []).filter((e) => e.id !== eduId),
      }));
    } finally {
      setIsSaving(false);
    }
  };

  // Handle initial creation
  const handleInitialCreate = async (formData) => {
    setIsSaving(true);
    try {
      const response = await apiClient.post('/resumes', formData);
      navigate(`/resume/${response.data.id}/edit`, { replace: true });
    } catch (err) {
      alert(`Failed to create resume: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isNew) {
    return (
      <div style={{ maxWidth: '700px', margin: '2rem auto', padding: '1.5rem', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <h2 style={{ marginTop: 0 }}>Create New Resume</h2>
        <ResumeForm onSubmit={handleInitialCreate} onCancel={() => navigate('/dashboard')} isLoading={isSaving} />
      </div>
    );
  }

  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '4rem' }}>Loading resume editor...</div>;
  }

  if (error || !resume) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: '#dc2626' }}>
        <h3>Error: {error || 'Resume not found'}</h3>
        <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 1rem' }}>
      {/* Header & Tab Switcher */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ margin: 0, color: '#0f172a' }}>{resume.title}</h2>
          <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Last updated: {new Date(resume.updatedAt).toLocaleDateString()}</span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <div style={{ backgroundColor: '#e2e8f0', padding: '0.2rem', borderRadius: '6px', display: 'flex' }}>
            <button
              onClick={() => setActiveTab('edit')}
              style={{
                backgroundColor: activeTab === 'edit' ? '#fff' : 'transparent',
                color: activeTab === 'edit' ? '#0f172a' : '#64748b',
                border: 'none',
                padding: '0.4rem 0.8rem',
                borderRadius: '4px',
                fontWeight: activeTab === 'edit' ? 'bold' : 'normal',
                cursor: 'pointer'
              }}
            >
              ✏️ Editor
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              style={{
                backgroundColor: activeTab === 'preview' ? '#fff' : 'transparent',
                color: activeTab === 'preview' ? '#0f172a' : '#64748b',
                border: 'none',
                padding: '0.4rem 0.8rem',
                borderRadius: '4px',
                fontWeight: activeTab === 'preview' ? 'bold' : 'normal',
                cursor: 'pointer'
              }}
            >
              👁️ Preview
            </button>
          </div>

          <button
            onClick={() => window.print()}
            style={{
              backgroundColor: '#059669',
              color: '#fff',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            📥 Export / Print PDF
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            style={{ padding: '0.5rem 1rem', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', backgroundColor: '#fff' }}
          >
            &larr; Dashboard
          </button>
        </div>
      </div>

      {activeTab === 'edit' ? (
        <>
          <ResumeDetailsSection resume={resume} onSave={handleSaveResumeFields} isLoading={isSaving} />
          <AiGenerationSection resume={resume} onApplyGeneratedContent={handleSaveResumeFields} />
          <SummarySection resume={resume} onSave={handleSaveResumeFields} isLoading={isSaving} />
          <SkillsSection resume={resume} onSave={handleSaveResumeFields} isLoading={isSaving} />
          <ExperienceSection
            experiences={resume.experiences || []}
            onAdd={handleAddExperience}
            onUpdate={handleUpdateExperience}
            onDelete={handleDeleteExperience}
            isLoading={isSaving}
          />
          <EducationSection
            education={resume.education || []}
            onAdd={handleAddEducation}
            onUpdate={handleUpdateEducation}
            onDelete={handleDeleteEducation}
            isLoading={isSaving}
          />
        </>
      ) : (
        <ResumePreview resume={resume} />
      )}
    </div>
  );
}
