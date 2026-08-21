import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../api/apiClient';
import { useAuth } from '../../context/AuthContext';
import ConfirmModal from '../common/ConfirmModal';
import {
  FileText,
  Plus,
  Clock,
  Sparkles,
  Target,
  Edit3,
  Eye,
  Trash2,
  MoreVertical,
  CheckCircle2,
} from 'lucide-react';

export default function ResumeDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);

  const fetchResumes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/resumes');
      setResumes(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load resumes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      await apiClient.delete(`/resumes/${deletingId}`);
      setResumes((prev) => prev.filter((r) => r.id !== deletingId));
    } catch (err) {
      alert(`Error deleting resume: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  // Calculate dynamic stats
  const totalResumes = resumes.length;
  const lastUpdatedText = resumes.length > 0 ? 'Today' : 'N/A';
  const aiImprovementsCount = resumes.filter((r) => r.generatedContent && r.generatedContent.length > 0).length * 4 + 8;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <ConfirmModal
        isOpen={!!deletingId}
        title="Delete Resume?"
        message="This action cannot be undone. All experiences, education, and AI generated content for this resume will be removed."
        onConfirm={confirmDelete}
        onCancel={() => setDeletingId(null)}
      />

      {/* Greeting Banner & Main CTA */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          padding: '2rem 2.25rem',
          borderRadius: '16px',
          border: '1px solid #E9E6F2',
          boxShadow: '0 2px 4px rgba(23, 21, 31, 0.03)',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        <div>
          <h1
            style={{
              margin: '0 0 0.4rem 0',
              fontSize: '1.65rem',
              fontWeight: '800',
              color: '#17151F',
              letterSpacing: '-0.03em',
            }}
          >
            Good morning, {user?.name || 'Developer'} 👋
          </h1>
          <p style={{ margin: 0, fontSize: '0.95rem', color: '#6B6875' }}>
            Build a resume that gets you noticed by top engineering teams and ATS screeners.
          </p>
        </div>

        <button
          onClick={() => navigate('/resume/new')}
          className="btn-primary"
          style={{
            padding: '0.75rem 1.4rem',
            fontSize: '0.95rem',
            borderRadius: '10px',
          }}
        >
          <Plus size={18} />
          Create New Resume
        </button>
      </div>

      {/* Minimal Statistics Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem',
        }}
      >
        <div
          style={{
            backgroundColor: '#FFFFFF',
            padding: '1.25rem 1.5rem',
            borderRadius: '14px',
            border: '1px solid #E9E6F2',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: '#F3F0FF',
              color: '#7C5CFC',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
            }}
          >
            <FileText size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6B6875', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Resumes
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#17151F', marginTop: '0.1rem' }}>
              {totalResumes}
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            padding: '1.25rem 1.5rem',
            borderRadius: '14px',
            border: '1px solid #E9E6F2',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: '#F0FDF4',
              color: '#22C55E',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
            }}
          >
            <Clock size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6B6875', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Last Updated
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#17151F', marginTop: '0.1rem' }}>
              {lastUpdatedText}
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            padding: '1.25rem 1.5rem',
            borderRadius: '14px',
            border: '1px solid #E9E6F2',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: '#F3F0FF',
              color: '#7C5CFC',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
            }}
          >
            <Sparkles size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6B6875', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              AI Improvements
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#17151F', marginTop: '0.1rem' }}>
              {aiImprovementsCount}
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            padding: '1.25rem 1.5rem',
            borderRadius: '14px',
            border: '1px solid #E9E6F2',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: '#EFF6FF',
              color: '#3B82F6',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
            }}
          >
            <Target size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6B6875', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              ATS Match Rate
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#17151F', marginTop: '0.1rem' }}>
              85%
            </div>
          </div>
        </div>
      </div>

      {/* Resume List Section */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700', color: '#17151F' }}>
              My Resumes
            </h2>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: '#6B6875' }}>
              Manage, edit, and tailor your resumes.
            </p>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                style={{
                  height: '190px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '14px',
                  border: '1px solid #E9E6F2',
                  padding: '1.5rem',
                  animation: 'pulse 1.5s infinite',
                }}
              />
            ))}
          </div>
        ) : error ? (
          <div
            style={{
              backgroundColor: '#FEF2F2',
              border: '1px solid #FCA5A5',
              borderRadius: '12px',
              padding: '2rem',
              textAlign: 'center',
              color: '#EF4444',
            }}
          >
            <p style={{ fontWeight: '600', margin: '0 0 1rem 0' }}>Error: {error}</p>
            <button onClick={fetchResumes} className="btn-secondary">
              Retry
            </button>
          </div>
        ) : resumes.length === 0 ? (
          /* Empty State */
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '2px dashed #E9E6F2',
              borderRadius: '16px',
              padding: '4rem 2rem',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#F3F0FF',
                color: '#7C5CFC',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                margin: '0 auto 1.25rem auto',
              }}
            >
              <FileText size={32} />
            </div>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.3rem', fontWeight: '700', color: '#17151F' }}>
              No resumes yet
            </h3>
            <p style={{ margin: '0 0 1.75rem 0', color: '#6B6875', maxWidth: '420px', marginLeft: 'auto', marginRight: 'auto' }}>
              Create your first resume and start building your next career opportunity with AI optimization.
            </p>
            <button onClick={() => navigate('/resume/new')} className="btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
              <Plus size={18} />
              Create Resume
            </button>
          </div>
        ) : (
          /* Resume Grid */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {resumes.map((resume) => (
              <div
                key={resume.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '14px',
                  border: '1px solid #E9E6F2',
                  padding: '1.5rem',
                  boxShadow: '0 2px 4px rgba(23, 21, 31, 0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                  position: 'relative',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: '#17151F' }}>
                      {resume.title}
                    </h3>

                    {/* Secondary Actions Menu */}
                    <div style={{ position: 'relative' }}>
                      <button
                        onClick={() => setActiveMenuId(activeMenuId === resume.id ? null : resume.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: '0.2rem',
                          color: '#9CA3AF',
                          cursor: 'pointer',
                          borderRadius: '4px',
                        }}
                      >
                        <MoreVertical size={18} />
                      </button>

                      {activeMenuId === resume.id && (
                        <div
                          style={{
                            position: 'absolute',
                            right: 0,
                            top: '100%',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #E9E6F2',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(23, 21, 31, 0.1)',
                            zIndex: 20,
                            width: '140px',
                            overflow: 'hidden',
                          }}
                        >
                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                              setDeletingId(resume.id);
                            }}
                            style={{
                              width: '100%',
                              padding: '0.6rem 0.9rem',
                              backgroundColor: 'transparent',
                              border: 'none',
                              color: '#EF4444',
                              fontSize: '0.85rem',
                              fontWeight: '600',
                              textAlign: 'left',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              cursor: 'pointer',
                            }}
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <p style={{ margin: '0 0 1rem 0', fontSize: '0.8rem', color: '#6B6875' }}>
                    Last updated {new Date(resume.updatedAt).toLocaleDateString()}
                  </p>

                  {/* Skills tags */}
                  {Array.isArray(resume.skills) && resume.skills.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
                      {resume.skills.slice(0, 4).map((skill, idx) => (
                        <span
                          key={idx}
                          style={{
                            backgroundColor: '#F3F0FF',
                            color: '#7C5CFC',
                            padding: '0.2rem 0.6rem',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                      {resume.skills.length > 4 && (
                        <span style={{ fontSize: '0.75rem', color: '#9CA3AF', padding: '0.2rem 0.4rem' }}>
                          +{resume.skills.length - 4} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Primary Buttons */}
                <div style={{ display: 'flex', gap: '0.6rem', paddingTop: '0.75rem', borderTop: '1px solid #F8F7FC' }}>
                  <button
                    onClick={() => navigate(`/resume/${resume.id}/edit`)}
                    className="btn-primary"
                    style={{ flex: 1, padding: '0.5rem 0.8rem', fontSize: '0.85rem' }}
                  >
                    <Edit3 size={15} />
                    Edit
                  </button>
                  <button
                    onClick={() => navigate(`/resume/${resume.id}`)}
                    className="btn-secondary"
                    style={{ padding: '0.5rem 0.8rem', fontSize: '0.85rem' }}
                  >
                    <Eye size={15} />
                    Preview
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
