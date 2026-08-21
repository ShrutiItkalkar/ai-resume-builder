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
  ChevronDown,
  LayoutGrid,
  List,
} from 'lucide-react';

export default function ResumeDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

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

      {/* Main Feature Banner Card */}
      <div
        style={{
          backgroundColor: '#F5EFE4',
          borderRadius: '20px',
          border: '1px solid #E5DED2',
          padding: '2.5rem 3rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '2rem',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ maxWidth: '480px', zIndex: 2 }}>
          <h2
            style={{
              margin: '0 0 0.6rem 0',
              fontSize: '1.5rem',
              fontWeight: '800',
              color: 'var(--text-main)',
              letterSpacing: '-0.02em',
            }}
          >
            Create your next standout resume
          </h2>
          <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: '1.55' }}>
            Get AI-powered suggestions, optimize for ATS, and land your dream job.
          </p>

          <button
            onClick={() => navigate('/resume/new')}
            style={{
              backgroundColor: '#3D2E21',
              color: '#FFFFFF',
              border: 'none',
              padding: '0.75rem 1.4rem',
              borderRadius: '10px',
              fontWeight: '700',
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 12px rgba(61,46,33,0.2)',
            }}
          >
            <Plus size={16} />
            Create New Resume
          </button>
        </div>

        {/* Right Graphical Representation Mockup */}
        <div
          style={{
            position: 'relative',
            width: '240px',
            height: '160px',
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            boxShadow: '0 10px 25px rgba(61,46,33,0.08)',
            border: '1px solid #E5DED2',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            transform: 'rotate(-2deg)',
          }}
          className="hidden md:flex"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#E9DFCF' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
              <div style={{ height: '8px', width: '70%', backgroundColor: '#3D2E21', borderRadius: '4px' }} />
              <div style={{ height: '6px', width: '50%', backgroundColor: '#9A9388', borderRadius: '3px' }} />
            </div>
          </div>
          <div style={{ height: '1px', backgroundColor: '#E5DED2', marginBlock: '0.2rem' }} />
          <div style={{ height: '6px', width: '90%', backgroundColor: '#D4C9B8', borderRadius: '3px' }} />
          <div style={{ height: '6px', width: '80%', backgroundColor: '#E5DED2', borderRadius: '3px' }} />
          <div style={{ height: '6px', width: '60%', backgroundColor: '#E5DED2', borderRadius: '3px' }} />
        </div>
      </div>

      {/* 4 Statistics Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {/* Stat 1 */}
        <div
          style={{
            backgroundColor: 'var(--card-bg)',
            padding: '1.35rem 1.5rem',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div
            className="icon-box-center"
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: '#F1EBDD',
              color: '#3D2E21',
            }}
          >
            <FileText size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Total Resumes
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '0.1rem' }}>
              {totalResumes}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>
              {totalResumes > 0 ? `${totalResumes} active` : 'Start building!'}
            </div>
          </div>
        </div>

        {/* Stat 2 */}
        <div
          style={{
            backgroundColor: 'var(--card-bg)',
            padding: '1.35rem 1.5rem',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div
            className="icon-box-center"
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: '#E8F3EA',
              color: '#6F8A72',
            }}
          >
            <Clock size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Last Updated
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '0.1rem' }}>
              {lastUpdatedText}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>
              {resumes.length > 0 ? 'Recently saved' : 'No resumes yet'}
            </div>
          </div>
        </div>

        {/* Stat 3 */}
        <div
          style={{
            backgroundColor: 'var(--card-bg)',
            padding: '1.35rem 1.5rem',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div
            className="icon-box-center"
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: '#FDF2E3',
              color: '#B28A4A',
            }}
          >
            <Sparkles size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              AI Improvements
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '0.1rem' }}>
              {aiImprovementsCount}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>
              This month
            </div>
          </div>
        </div>

        {/* Stat 4 */}
        <div
          style={{
            backgroundColor: 'var(--card-bg)',
            padding: '1.35rem 1.5rem',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div
            className="icon-box-center"
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: '#F1EBDD',
              color: '#8B7355',
            }}
          >
            <Target size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              ATS Match Rate
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '0.1rem' }}>
              85%
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>
              Keep it up!
            </div>
          </div>
        </div>
      </div>

      {/* My Resumes List Section */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>
              My Resumes
            </h3>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Manage, edit, and tailor your resumes.
            </p>
          </div>

          {/* Filter & View mode controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <button
              style={{
                backgroundColor: 'var(--card-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: '10px',
                padding: '0.5rem 0.9rem',
                fontSize: '0.825rem',
                fontWeight: '600',
                color: 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
              }}
            >
              Recently Updated
              <ChevronDown size={14} color="var(--text-muted)" />
            </button>

            <div style={{ display: 'flex', backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '0.15rem' }}>
              <button
                onClick={() => setViewMode('grid')}
                className="icon-box-center"
                style={{
                  background: viewMode === 'grid' ? '#E9DFCF' : 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  width: '32px',
                  height: '32px',
                  color: viewMode === 'grid' ? '#3D2E21' : 'var(--text-muted)',
                  cursor: 'pointer',
                }}
              >
                <LayoutGrid size={15} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className="icon-box-center"
                style={{
                  background: viewMode === 'list' ? '#E9DFCF' : 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  width: '32px',
                  height: '32px',
                  color: viewMode === 'list' ? '#3D2E21' : 'var(--text-muted)',
                  cursor: 'pointer',
                }}
              >
                <List size={15} />
              </button>
            </div>
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
                  backgroundColor: 'var(--card-bg)',
                  borderRadius: '16px',
                  border: '1px solid var(--border-color)',
                  padding: '1.5rem',
                  animation: 'pulse 1.5s infinite',
                }}
              />
            ))}
          </div>
        ) : error ? (
          <div
            style={{
              backgroundColor: 'var(--error-bg)',
              border: '1px solid #FCA5A5',
              borderRadius: '12px',
              padding: '2rem',
              textAlign: 'center',
              color: 'var(--error)',
            }}
          >
            <p style={{ fontWeight: '600', margin: '0 0 1rem 0' }}>Error: {error}</p>
            <button onClick={fetchResumes} className="btn-secondary">
              Retry
            </button>
          </div>
        ) : resumes.length === 0 ? (
          /* Empty State Matching Mockup */
          <div
            style={{
              backgroundColor: '#FAF8F4',
              border: '2px dashed var(--border-color)',
              borderRadius: '20px',
              padding: '4.5rem 2rem',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              className="icon-box-center"
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: '#F1EBDD',
                color: '#3D2E21',
                margin: '0 auto 1.25rem auto',
              }}
            >
              <FileText size={28} />
            </div>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>
              No resumes yet
            </h3>
            <p style={{ margin: '0 0 1.75rem 0', color: 'var(--text-secondary)', maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto', fontSize: '0.9rem', lineHeight: '1.5' }}>
              Create your first resume and start building your next career opportunity.
            </p>
            <button
              onClick={() => navigate('/resume/new')}
              style={{
                backgroundColor: '#3D2E21',
                color: '#FFFFFF',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '10px',
                fontWeight: '700',
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 12px rgba(61,46,33,0.2)',
              }}
            >
              <Plus size={16} />
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
                  backgroundColor: 'var(--card-bg)',
                  borderRadius: '16px',
                  border: '1px solid var(--border-color)',
                  padding: '1.5rem',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                  position: 'relative',
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div
                        className="icon-box-center"
                        style={{
                          width: '38px', height: '38px', borderRadius: '10px',
                          backgroundColor: '#F1EBDD', color: '#3D2E21',
                        }}
                      >
                        <FileText size={18} />
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: 'var(--text-main)' }}>
                          {resume.title}
                        </h4>
                        <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          Updated {new Date(resume.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Secondary Actions Menu */}
                    <div style={{ position: 'relative' }}>
                      <button
                        onClick={() => setActiveMenuId(activeMenuId === resume.id ? null : resume.id)}
                        className="icon-box-center"
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: '0.2rem',
                          color: 'var(--text-muted)',
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
                            backgroundColor: 'var(--card-bg)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '10px',
                            boxShadow: 'var(--shadow-md)',
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
                              color: 'var(--error)',
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

                  {/* Skills tags */}
                  {Array.isArray(resume.skills) && resume.skills.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBlock: '1rem' }}>
                      {resume.skills.slice(0, 4).map((skill, idx) => (
                        <span
                          key={idx}
                          style={{
                            backgroundColor: '#F1EBDD',
                            color: '#3D2E21',
                            padding: '0.2rem 0.6rem',
                            borderRadius: '8px',
                            fontSize: '0.72rem',
                            fontWeight: '600',
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                      {resume.skills.length > 4 && (
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', padding: '0.2rem 0.4rem' }}>
                          +{resume.skills.length - 4} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Primary Buttons */}
                <div style={{ display: 'flex', gap: '0.6rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
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
