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
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '16px',
          border: '1px solid #E9E6F2',
          padding: '2rem',
          boxShadow: '0 2px 8px rgba(23,21,31,0.05)',
        }}>
          <h2 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: '700', color: '#17151F' }}>
            Create New Resume
          </h2>
          <ResumeForm onSubmit={handleInitialCreate} onCancel={() => navigate('/dashboard')} isLoading={isSaving} />
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: '#6B6875' }}>
        Loading resume editor...
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <p style={{ color: '#EF4444', fontWeight: '600' }}>Error: {error || 'Resume not found'}</p>
        <button className="btn-secondary" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0' }}>
      {/* Tab Switcher */}
      <div className="no-print" style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '1.5rem',
        backgroundColor: '#F8F7FC',
        padding: '0.35rem',
        borderRadius: '10px',
        border: '1px solid #E9E6F2',
        width: 'fit-content',
      }}>
        <button
          onClick={() => setActiveTab('edit')}
          style={{
            padding: '0.5rem 1.25rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            borderRadius: '7px',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: activeTab === 'edit' ? '#FFFFFF' : 'transparent',
            color: activeTab === 'edit' ? '#17151F' : '#6B6875',
            boxShadow: activeTab === 'edit' ? '0 1px 3px rgba(23,21,31,0.1)' : 'none',
            transition: 'all 0.15s ease',
          }}
        >
          ✏️ Editor
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          style={{
            padding: '0.5rem 1.25rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            borderRadius: '7px',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: activeTab === 'preview' ? '#FFFFFF' : 'transparent',
            color: activeTab === 'preview' ? '#17151F' : '#6B6875',
            boxShadow: activeTab === 'preview' ? '0 1px 3px rgba(23,21,31,0.1)' : 'none',
            transition: 'all 0.15s ease',
          }}
        >
          👁️ Preview
        </button>
      </div>

      {activeTab === 'edit' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
        </div>
      ) : (
        <ResumePreview resume={resume} />
      )}
    </div>
  );
}
