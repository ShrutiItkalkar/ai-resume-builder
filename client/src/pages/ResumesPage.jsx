import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api/apiClient';
import ConfirmModal from '../components/common/ConfirmModal';
import { Plus, FileText, Edit3, Eye, Trash2, Clock } from 'lucide-react';

export default function ResumesPage() {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

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

  useEffect(() => { fetchResumes(); }, []);

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <ConfirmModal
        isOpen={!!deletingId}
        title="Delete Resume?"
        message="This action cannot be undone. All data for this resume will be permanently removed."
        onConfirm={confirmDelete}
        onCancel={() => setDeletingId(null)}
      />

      {/* Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          className="btn-primary"
          onClick={() => navigate('/resume/new')}
          style={{ padding: '0.7rem 1.4rem', fontSize: '0.9rem', borderRadius: '10px' }}
        >
          <Plus size={17} />
          Create Resume
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {[1, 2, 3].map((n) => (
            <div key={n} style={{
              height: '180px', backgroundColor: 'var(--card-bg)', borderRadius: '14px',
              border: '1px solid var(--border-color)', animation: 'pulse 1.5s infinite',
            }} />
          ))}
        </div>
      ) : error ? (
        <div style={{
          backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '12px',
          padding: '2rem', textAlign: 'center', color: '#EF4444',
        }}>
          <p style={{ fontWeight: '600', margin: '0 0 1rem 0' }}>Error: {error}</p>
          <button onClick={fetchResumes} className="btn-secondary">Retry</button>
        </div>
      ) : resumes.length === 0 ? (
        /* Empty State */
        <div style={{
          backgroundColor: 'var(--card-bg)', border: '2px dashed var(--border-color)', borderRadius: '20px',
          padding: '5rem 2rem', textAlign: 'center',
        }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '50%', backgroundColor: 'var(--primary-light)',
            color: '#7C5CFC', display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.5rem auto',
          }}>
            <FileText size={32} />
          </div>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.35rem', fontWeight: '700', color: 'var(--text-main)' }}>
            No resumes yet
          </h3>
          <p style={{ margin: '0 0 2rem 0', color: 'var(--text-secondary)', maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto' }}>
            Create your first resume and start building your career with AI-powered optimization.
          </p>
          <button onClick={() => navigate('/resume/new')} className="btn-primary" style={{ padding: '0.8rem 1.75rem' }}>
            <Plus size={18} />
            Create Resume
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {resumes.map((resume) => (
            <div key={resume.id} style={{
              backgroundColor: 'var(--card-bg)', borderRadius: '16px', border: '1px solid var(--border-color)',
              padding: '1.5rem', boxShadow: 'var(--shadow-sm)',
              display: 'flex', flexDirection: 'column', gap: '1rem',
              transition: 'box-shadow 0.2s ease, transform 0.2s ease',
            }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {/* Card Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--primary-light)',
                  color: '#7C5CFC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <FileText size={20} />
                </div>
                <button
                  onClick={() => setDeletingId(resume.id)}
                  style={{
                    background: 'none', border: 'none', padding: '0.25rem', color: 'var(--text-muted)',
                    cursor: 'pointer', borderRadius: '6px',
                  }}
                  title="Delete resume"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Resume Info */}
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 0.4rem 0', fontSize: '1rem', fontWeight: '700', color: 'var(--text-main)' }}>
                  {resume.title}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                  <Clock size={13} />
                  <span>Updated {new Date(resume.updatedAt).toLocaleDateString()}</span>
                </div>

                {Array.isArray(resume.skills) && resume.skills.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.75rem' }}>
                    {resume.skills.slice(0, 3).map((skill, idx) => (
                      <span key={idx} style={{
                        backgroundColor: 'var(--primary-light)', color: '#7C5CFC',
                        padding: '0.2rem 0.6rem', borderRadius: '10px', fontSize: '0.72rem', fontWeight: '600',
                      }}>
                        {skill}
                      </span>
                    ))}
                    {resume.skills.length > 3 && (
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', padding: '0.2rem 0.3rem' }}>
                        +{resume.skills.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.6rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                <button
                  onClick={() => navigate(`/resume/${resume.id}/edit`)}
                  className="btn-primary"
                  style={{ flex: 1, padding: '0.5rem', fontSize: '0.82rem' }}
                >
                  <Edit3 size={14} />
                  Edit
                </button>
                <button
                  onClick={() => navigate(`/resume/${resume.id}`)}
                  className="btn-secondary"
                  style={{ flex: 1, padding: '0.5rem', fontSize: '0.82rem' }}
                >
                  <Eye size={14} />
                  Preview
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
