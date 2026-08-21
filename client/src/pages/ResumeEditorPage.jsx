import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Briefcase,
  GraduationCap,
  Sparkles,
  Phone,
  Mail,
  Globe,
  MapPin,
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  Edit2,
  Printer,
  CheckCircle,
} from 'lucide-react';
import AiGenerationSection from '../components/resume/AiGenerationSection';

export default function ResumeEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isNew = !id || id === 'new';

  const [currentStep, setCurrentStep] = useState(1);
  const [resume, setResume] = useState(null);
  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // Form states for Personal Info
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [linkedIn, setLinkedIn] = useState('');
  const [location, setLocation] = useState('');
  const [title, setTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  // Experience Form states
  const [expCompany, setExpCompany] = useState('');
  const [expRole, setExpRole] = useState('');
  const [expStartDate, setExpStartDate] = useState('');
  const [expEndDate, setExpEndDate] = useState('');
  const [expDescription, setExpDescription] = useState('');
  const [editingExpId, setEditingExpId] = useState(null);
  const [isAddingExp, setIsAddingExp] = useState(false);

  // Education Form states
  const [eduInstitution, setEduInstitution] = useState('');
  const [eduDegree, setEduDegree] = useState('');
  const [eduGradYear, setEduGradYear] = useState('');
  const [editingEduId, setEditingEduId] = useState(null);
  const [isAddingEdu, setIsAddingEdu] = useState(false);

  // Summary & Skills state
  const [summary, setSummary] = useState('');
  const [skillsText, setSkillsText] = useState('');

  // Load existing resume
  useEffect(() => {
    if (isNew) {
      setResume({
        title: 'Software Engineer Resume',
        summary: '',
        jobDescription: '',
        skills: [],
        experiences: [],
        education: [],
      });
      setTitle('Software Engineer Resume');
      return;
    }

    const fetchResume = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiClient.get(`/resumes/${id}`);
        const data = response.data;
        setResume(data);
        setTitle(data.title || '');
        setSummary(data.summary || '');
        setJobDescription(data.jobDescription || '');
        setSkillsText(Array.isArray(data.skills) ? data.skills.join(', ') : '');
      } catch (err) {
        setError(err.message || 'Failed to load resume details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResume();
  }, [id]);

  // Helper to persist/save main resume details
  const saveMainDetails = async (overrides = {}) => {
    setIsSaving(true);
    const skillsArray = (overrides.skillsText !== undefined ? overrides.skillsText : skillsText)
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const payload = {
      title: (overrides.title !== undefined ? overrides.title : title).trim() || 'My Resume',
      summary: (overrides.summary !== undefined ? overrides.summary : summary).trim() || null,
      jobDescription: (overrides.jobDescription !== undefined ? overrides.jobDescription : jobDescription).trim() || null,
      skills: skillsArray,
    };

    try {
      if (!resume?.id) {
        // Create new
        const response = await apiClient.post('/resumes', payload);
        setResume(response.data);
        navigate(`/resume/${response.data.id}/edit`, { replace: true });
        return response.data;
      } else {
        // Update existing
        const response = await apiClient.put(`/resumes/${resume.id}`, payload);
        setResume((prev) => ({ ...prev, ...response.data }));
        return response.data;
      }
    } catch (err) {
      alert(`Error saving details: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Experience Handlers
  const handleSaveExperience = async (e) => {
    e.preventDefault();
    if (!expCompany.trim() || !expRole.trim() || !expStartDate.trim()) return;

    setIsSaving(true);
    const expPayload = {
      company: expCompany.trim(),
      role: expRole.trim(),
      startDate: expStartDate.trim(),
      endDate: expEndDate.trim() || null,
      description: expDescription.trim() || null,
    };

    try {
      if (!resume?.id) {
        const savedResume = await saveMainDetails();
        if (!savedResume?.id) return;
        const res = await apiClient.post(`/resumes/${savedResume.id}/experiences`, expPayload);
        setResume((prev) => ({ ...prev, experiences: [...(prev.experiences || []), res.data] }));
      } else if (editingExpId) {
        const res = await apiClient.put(`/resumes/${resume.id}/experiences/${editingExpId}`, expPayload);
        setResume((prev) => ({
          ...prev,
          experiences: (prev.experiences || []).map((exp) => (exp.id === editingExpId ? res.data : exp)),
        }));
      } else {
        const res = await apiClient.post(`/resumes/${resume.id}/experiences`, expPayload);
        setResume((prev) => ({ ...prev, experiences: [...(prev.experiences || []), res.data] }));
      }
      resetExpForm();
    } catch (err) {
      alert(`Error saving experience: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const resetExpForm = () => {
    setExpCompany('');
    setExpRole('');
    setExpStartDate('');
    setExpEndDate('');
    setExpDescription('');
    setEditingExpId(null);
    setIsAddingExp(false);
  };

  const startEditExp = (exp) => {
    setEditingExpId(exp.id);
    setExpCompany(exp.company || '');
    setExpRole(exp.role || '');
    setExpStartDate(exp.startDate || '');
    setExpEndDate(exp.endDate || '');
    setExpDescription(exp.description || '');
    setIsAddingExp(true);
  };

  const handleDeleteExp = async (expId) => {
    if (!window.confirm('Delete this experience entry?')) return;
    setIsSaving(true);
    try {
      await apiClient.delete(`/resumes/${resume.id}/experiences/${expId}`);
      setResume((prev) => ({
        ...prev,
        experiences: (prev.experiences || []).filter((e) => e.id !== expId),
      }));
    } catch (err) {
      alert(`Error deleting experience: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Education Handlers
  const handleSaveEducation = async (e) => {
    e.preventDefault();
    const gradYearNum = parseInt(eduGradYear, 10);
    if (!eduInstitution.trim() || !eduDegree.trim() || isNaN(gradYearNum)) return;

    setIsSaving(true);
    const eduPayload = {
      institution: eduInstitution.trim(),
      degree: eduDegree.trim(),
      graduationYear: gradYearNum,
    };

    try {
      if (!resume?.id) {
        const savedResume = await saveMainDetails();
        if (!savedResume?.id) return;
        const res = await apiClient.post(`/resumes/${savedResume.id}/education`, eduPayload);
        setResume((prev) => ({ ...prev, education: [...(prev.education || []), res.data] }));
      } else if (editingEduId) {
        const res = await apiClient.put(`/resumes/${resume.id}/education/${editingEduId}`, eduPayload);
        setResume((prev) => ({
          ...prev,
          education: (prev.education || []).map((edu) => (edu.id === editingEduId ? res.data : edu)),
        }));
      } else {
        const res = await apiClient.post(`/resumes/${resume.id}/education`, eduPayload);
        setResume((prev) => ({ ...prev, education: [...(prev.education || []), res.data] }));
      }
      resetEduForm();
    } catch (err) {
      alert(`Error saving education: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const resetEduForm = () => {
    setEduInstitution('');
    setEduDegree('');
    setEduGradYear('');
    setEditingEduId(null);
    setIsAddingEdu(false);
  };

  const startEditEdu = (edu) => {
    setEditingEduId(edu.id);
    setEduInstitution(edu.institution || '');
    setEduDegree(edu.degree || '');
    setEduGradYear(edu.graduationYear ? String(edu.graduationYear) : '');
    setIsAddingEdu(true);
  };

  const handleDeleteEdu = async (eduId) => {
    if (!window.confirm('Delete this education entry?')) return;
    setIsSaving(true);
    try {
      await apiClient.delete(`/resumes/${resume.id}/education/${eduId}`);
      setResume((prev) => ({
        ...prev,
        education: (prev.education || []).filter((e) => e.id !== eduId),
      }));
    } catch (err) {
      alert(`Error deleting education: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleNextStep = async () => {
    if (currentStep === 1) {
      await saveMainDetails();
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setCurrentStep(4);
    } else {
      await saveMainDetails();
      navigate('/resumes');
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const handleApplyGeneratedContent = (newContent) => {
    if (newContent.summary) {
      setSummary(newContent.summary);
      saveMainDetails({ summary: newContent.summary });
    }
    if (Array.isArray(newContent.skills)) {
      const merged = Array.from(new Set([...(resume?.skills || []), ...newContent.skills]));
      const formatted = merged.join(', ');
      setSkillsText(formatted);
      saveMainDetails({ skillsText: formatted });
    }
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem', color: '#8B7355' }}>
        Loading resume builder...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem', color: '#B85C5C' }}>
        <p>Error: {error}</p>
        <button className="btn-secondary" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  const steps = [
    { num: 1, label: 'Personal', icon: User },
    { num: 2, label: 'Experience', icon: Briefcase },
    { num: 3, label: 'Education', icon: GraduationCap },
    { num: 4, label: 'Finalize', icon: Sparkles },
  ];

  return (
    <div
      style={{
        backgroundColor: 'var(--card-bg)',
        borderRadius: '24px',
        border: '1px solid var(--border-color)',
        padding: '2.5rem 2rem',
        color: 'var(--text-main)',
        minHeight: '100vh',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Top Header Section */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1
          style={{
            margin: '0 0 0.5rem 0',
            fontSize: '2rem',
            fontWeight: '800',
            letterSpacing: '-0.02em',
            color: 'var(--text-main)',
          }}
        >
          {isNew ? 'Create Your Professional Resume' : 'Edit Your Professional Resume'}
        </h1>
        <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
          Build a stunning resume with our intuitive form and real-time preview
        </p>

        <div
          style={{
            width: '60px',
            height: '3px',
            borderRadius: '2px',
            backgroundColor: '#3D2E21',
            margin: '1.25rem auto 0 auto',
          }}
        />
      </div>

      {/* Stepper Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          marginBottom: '3rem',
          flexWrap: 'wrap',
        }}
      >
        {steps.map((s, idx) => {
          const isActive = currentStep === s.num;
          const isCompleted = currentStep > s.num;

          return (
            <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                onClick={() => setCurrentStep(s.num)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.4rem',
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    lineHeight: 1,
                    padding: 0,
                    fontWeight: '700',
                    fontSize: '0.9rem',
                    backgroundColor: isActive ? '#3D2E21' : isCompleted ? '#8B7355' : 'var(--primary-light)',
                    color: isActive || isCompleted ? '#FFFFFF' : 'var(--text-secondary)',
                    border: isActive ? '2px solid #3D2E21' : '1px solid var(--border-color)',
                    boxShadow: isActive ? '0 0 12px rgba(61, 46, 33, 0.3)' : 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {s.num}
                </div>
                <span
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: isActive ? '700' : '500',
                    color: isActive ? '#3D2E21' : isCompleted ? 'var(--text-main)' : 'var(--text-muted)',
                  }}
                >
                  {s.label}
                </span>
              </div>

              {idx < steps.length - 1 && (
                <div
                  style={{
                    width: '60px',
                    height: '2px',
                    backgroundColor: isCompleted ? '#8B7355' : 'var(--border-color)',
                    marginBottom: '1.2rem',
                    transition: 'all 0.2s ease',
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Main Two-Column Split Layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(350px, 1fr) minmax(380px, 1.1fr)',
          gap: '2rem',
          alignItems: 'start',
        }}
      >
        {/* LEFT COLUMN: Step Form Card */}
        <div
          style={{
            backgroundColor: 'var(--bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '20px',
            padding: '2rem',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
          }}
        >
          {/* STEP 1: Personal Information */}
          {currentStep === 1 && (
            <>
              <div>
                <h2 style={{ margin: '0 0 0.25rem 0', fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)' }}>
                  Personal Information
                </h2>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Let's start with your basic details
                </p>
              </div>

              <div>
                <label>Full Name *</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.3rem', display: 'block' }}>
                  This will appear as the header of your resume
                </span>
              </div>

              <div>
                <label>Resume Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Senior Full Stack Developer"
                />
              </div>

              <div>
                <label>Contact Information</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.35rem' }}>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <Phone size={16} style={{ position: 'absolute', left: '0.8rem', color: '#8B7355' }} />
                    <input
                      type="text"
                      style={{ paddingLeft: '2.5rem' }}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0xxxxxxxxx"
                    />
                  </div>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <Mail size={16} style={{ position: 'absolute', left: '0.8rem', color: '#8B7355' }} />
                    <input
                      type="email"
                      style={{ paddingLeft: '2.5rem' }}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@gmail.com"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label>LinkedIn Profile</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Globe size={16} style={{ position: 'absolute', left: '0.8rem', color: '#8B7355' }} />
                  <input
                    type="text"
                    style={{ paddingLeft: '2.5rem' }}
                    value={linkedIn}
                    onChange={(e) => setLinkedIn(e.target.value)}
                    placeholder="linkedin.com/in/your-username"
                  />
                </div>
              </div>

              <div>
                <label>Location</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <MapPin size={16} style={{ position: 'absolute', left: '0.8rem', color: '#8B7355' }} />
                  <input
                    type="text"
                    style={{ paddingLeft: '2.5rem' }}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, State, Country"
                  />
                </div>
              </div>

              <div>
                <label>Target Job Description (Optional — for AI tailoring)</label>
                <textarea
                  rows={4}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the target job description here..."
                />
              </div>
            </>
          )}

          {/* STEP 2: Work Experience */}
          {currentStep === 2 && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ margin: '0 0 0.25rem 0', fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)' }}>
                    Work Experience
                  </h2>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Add your previous roles and key achievements
                  </p>
                </div>
                {!isAddingExp && (
                  <button
                    onClick={() => setIsAddingExp(true)}
                    className="btn-primary"
                    style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }}
                  >
                    <Plus size={14} /> Add Role
                  </button>
                )}
              </div>

              {/* Existing Experience List */}
              {(!resume?.experiences || resume.experiences.length === 0) && !isAddingExp && (
                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.875rem' }}>
                  No work experience entries added yet. Click "Add Role" to add your experience.
                </p>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {resume?.experiences?.map((exp) => (
                  <div
                    key={exp.id}
                    style={{
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '1rem',
                      backgroundColor: 'var(--card-bg)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <h4 style={{ margin: '0 0 0.2rem 0', fontSize: '0.95rem', color: 'var(--text-main)' }}>
                        {exp.role} <span style={{ color: '#8B7355' }}>at {exp.company}</span>
                      </h4>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {exp.startDate} &ndash; {exp.endDate || 'Present'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <button
                        onClick={() => startEditExp(exp)}
                        className="btn-secondary"
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        onClick={() => handleDeleteExp(exp.id)}
                        className="btn-danger"
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add / Edit Form */}
              {isAddingExp && (
                <form onSubmit={handleSaveExperience} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                  <h4 style={{ margin: 0, color: '#3D2E21', fontSize: '0.95rem', fontWeight: '700' }}>
                    {editingExpId ? 'Edit Work Experience' : 'New Work Experience'}
                  </h4>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label>Company *</label>
                      <input
                        type="text"
                        value={expCompany}
                        onChange={(e) => setExpCompany(e.target.value)}
                        placeholder="e.g. Acme Tech"
                        required
                      />
                    </div>
                    <div>
                      <label>Job Title / Role *</label>
                      <input
                        type="text"
                        value={expRole}
                        onChange={(e) => setExpRole(e.target.value)}
                        placeholder="e.g. Software Engineer"
                        required
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label>Start Date *</label>
                      <input
                        type="text"
                        value={expStartDate}
                        onChange={(e) => setExpStartDate(e.target.value)}
                        placeholder="e.g. Jan 2023"
                        required
                      />
                    </div>
                    <div>
                      <label>End Date</label>
                      <input
                        type="text"
                        value={expEndDate}
                        onChange={(e) => setExpEndDate(e.target.value)}
                        placeholder="e.g. Present"
                      />
                    </div>
                  </div>

                  <div>
                    <label>Description & Key Bullet Points</label>
                    <textarea
                      rows={3}
                      value={expDescription}
                      onChange={(e) => setExpDescription(e.target.value)}
                      placeholder="Describe metrics, responsibilities, and achievements..."
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <button type="button" onClick={resetExpForm} className="btn-secondary">
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary" disabled={isSaving}>
                      {isSaving ? 'Saving...' : 'Save Role'}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}

          {/* STEP 3: Education */}
          {currentStep === 3 && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ margin: '0 0 0.25rem 0', fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)' }}>
                    Education
                  </h2>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Add your academic degrees and background
                  </p>
                </div>
                {!isAddingEdu && (
                  <button
                    onClick={() => setIsAddingEdu(true)}
                    className="btn-primary"
                    style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }}
                  >
                    <Plus size={14} /> Add Education
                  </button>
                )}
              </div>

              {/* Existing Education List */}
              {(!resume?.education || resume.education.length === 0) && !isAddingEdu && (
                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.875rem' }}>
                  No education entries added yet. Click "Add Education" to add your degree.
                </p>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {resume?.education?.map((edu) => (
                  <div
                    key={edu.id}
                    style={{
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '1rem',
                      backgroundColor: 'var(--card-bg)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <h4 style={{ margin: '0 0 0.2rem 0', fontSize: '0.95rem', color: 'var(--text-main)' }}>
                        {edu.degree}
                      </h4>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {edu.institution} &bull; Class of {edu.graduationYear}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <button
                        onClick={() => startEditEdu(edu)}
                        className="btn-secondary"
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        onClick={() => handleDeleteEdu(edu.id)}
                        className="btn-danger"
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add / Edit Education Form */}
              {isAddingEdu && (
                <form onSubmit={handleSaveEducation} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                  <h4 style={{ margin: 0, color: '#3D2E21', fontSize: '0.95rem', fontWeight: '700' }}>
                    {editingEduId ? 'Edit Education' : 'New Education'}
                  </h4>

                  <div>
                    <label>Institution / University *</label>
                    <input
                      type="text"
                      value={eduInstitution}
                      onChange={(e) => setEduInstitution(e.target.value)}
                      placeholder="e.g. Stanford University"
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label>Degree / Major *</label>
                      <input
                        type="text"
                        value={eduDegree}
                        onChange={(e) => setEduDegree(e.target.value)}
                        placeholder="e.g. B.S. Computer Science"
                        required
                      />
                    </div>
                    <div>
                      <label>Graduation Year *</label>
                      <input
                        type="number"
                        value={eduGradYear}
                        onChange={(e) => setEduGradYear(e.target.value)}
                        placeholder="e.g. 2024"
                        required
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <button type="button" onClick={resetEduForm} className="btn-secondary">
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary" disabled={isSaving}>
                      {isSaving ? 'Saving...' : 'Save Education'}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}

          {/* STEP 4: Finalize & AI Tailor */}
          {currentStep === 4 && (
            <>
              <div>
                <h2 style={{ margin: '0 0 0.25rem 0', fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)' }}>
                  Finalize & Summary
                </h2>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Generate AI content and polish your skills
                </p>
              </div>

              <div>
                <label>Professional Summary</label>
                <textarea
                  rows={4}
                  value={summary}
                  onChange={(e) => {
                    setSummary(e.target.value);
                    saveMainDetails({ summary: e.target.value });
                  }}
                  placeholder="Enter a compelling summary of your career background..."
                />
              </div>

              <div>
                <label>Skills (Comma-separated)</label>
                <input
                  type="text"
                  value={skillsText}
                  onChange={(e) => {
                    setSkillsText(e.target.value);
                    saveMainDetails({ skillsText: e.target.value });
                  }}
                  placeholder="React, Node.js, PostgreSQL, TypeScript, Python"
                />
              </div>

              {/* AI Tailor Tool block */}
              {resume?.id && (
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                  <AiGenerationSection resume={resume} onApplyGeneratedContent={handleApplyGeneratedContent} />
                </div>
              )}
            </>
          )}

          {/* Bottom Step Control Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
            {currentStep > 1 ? (
              <button onClick={handlePrevStep} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ChevronLeft size={16} /> Back
              </button>
            ) : <div />}

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => window.print()}
                className="btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                title="Print / Export PDF"
              >
                <Printer size={16} /> Print PDF
              </button>

              <button
                onClick={handleNextStep}
                className="btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                disabled={isSaving}
              >
                {currentStep === 4 ? (
                  <>
                    <CheckCircle size={16} /> Finish & Save
                  </>
                ) : (
                  <>
                    Continue <ChevronRight size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Resume Preview Sheet */}
        <div
          className="resume-preview-container"
          style={{
            backgroundColor: '#FFFFFF',
            color: '#1E1B18',
            borderRadius: '20px',
            padding: '2.5rem 2.5rem',
            boxShadow: 'var(--shadow-md)',
            minHeight: '650px',
            position: 'sticky',
            top: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            border: '1px solid var(--border-color)',
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', borderBottom: '2px solid #3D2E21', paddingBottom: '1.25rem' }}>
            <h1
              style={{
                margin: '0 0 0.4rem 0',
                fontSize: '2rem',
                fontWeight: '800',
                letterSpacing: '-0.025em',
                color: '#1E1B18',
              }}
            >
              {fullName.trim() || user?.name || 'Your Name Here'}
            </h1>

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: '0.6rem',
                fontSize: '0.85rem',
                color: '#716B61',
              }}
            >
              {email && <span>{email}</span>}
              {phone && <span>&bull; {phone}</span>}
              {location && <span>&bull; {location}</span>}
              {linkedIn && <span>&bull; {linkedIn}</span>}
            </div>
          </div>

          {/* PROFESSIONAL SUMMARY */}
          <div>
            <h3
              style={{
                fontSize: '0.9rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: '#3D2E21',
                borderBottom: '1px solid #E5DED2',
                paddingBottom: '0.25rem',
                margin: '0 0 0.5rem 0',
              }}
            >
              Professional Summary
            </h3>
            {summary.trim() ? (
              <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.6', color: '#24221F' }}>
                {summary}
              </p>
            ) : (
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#9A9388', fontStyle: 'italic' }}>
                Enter your professional summary to see it here...
              </p>
            )}
          </div>

          {/* PROFESSIONAL EXPERIENCE */}
          <div>
            <h3
              style={{
                fontSize: '0.9rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: '#3D2E21',
                borderBottom: '1px solid #E5DED2',
                paddingBottom: '0.25rem',
                margin: '0 0 0.75rem 0',
              }}
            >
              Professional Experience
            </h3>
            {resume?.experiences && resume.experiences.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {resume.experiences.map((exp) => (
                  <div key={exp.id || exp.company}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontWeight: '700', fontSize: '0.95rem', color: '#24221F' }}>
                        {exp.role} &ndash; <span style={{ fontWeight: '500', color: '#716B61' }}>{exp.company}</span>
                      </span>
                      <span style={{ fontSize: '0.82rem', color: '#9A9388' }}>
                        {exp.startDate} &ndash; {exp.endDate || 'Present'}
                      </span>
                    </div>
                    {exp.description && (
                      <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.875rem', lineHeight: '1.5', color: '#24221F', whiteSpace: 'pre-line' }}>
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#9A9388', fontStyle: 'italic' }}>
                Add work experience to see it here...
              </p>
            )}
          </div>

          {/* EDUCATION */}
          <div>
            <h3
              style={{
                fontSize: '0.9rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: '#3D2E21',
                borderBottom: '1px solid #E5DED2',
                paddingBottom: '0.25rem',
                margin: '0 0 0.75rem 0',
              }}
            >
              Education
            </h3>
            {resume?.education && resume.education.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {resume.education.map((edu) => (
                  <div key={edu.id || edu.institution} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <div>
                      <span style={{ fontWeight: '700', fontSize: '0.925rem', color: '#24221F' }}>{edu.degree}</span>
                      <div style={{ fontSize: '0.85rem', color: '#716B61' }}>{edu.institution}</div>
                    </div>
                    <span style={{ fontSize: '0.82rem', color: '#9A9388' }}>Class of {edu.graduationYear}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#9A9388', fontStyle: 'italic' }}>
                Add education details to see them here...
              </p>
            )}
          </div>

          {/* SKILLS */}
          <div>
            <h3
              style={{
                fontSize: '0.9rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: '#3D2E21',
                borderBottom: '1px solid #E5DED2',
                paddingBottom: '0.25rem',
                margin: '0 0 0.5rem 0',
              }}
            >
              Skills
            </h3>
            {skillsText.trim() ? (
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#24221F', lineHeight: '1.5' }}>
                <strong>Skills:</strong> {skillsText}
              </p>
            ) : (
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#9A9388', fontStyle: 'italic' }}>
                Enter your skills to see them here...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
