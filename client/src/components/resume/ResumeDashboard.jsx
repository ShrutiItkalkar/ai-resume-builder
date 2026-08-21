import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../api/apiClient';
import { useAuth } from '../../context/AuthContext';
import ConfirmModal from '../common/ConfirmModal';

export default function ResumeDashboard() {
  const { user } = useAuth();
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

  useEffect(() => {
    fetchResumes();
  }, []);

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      await apiClient.delete(`/resumes/${deletingId}`);
      setResumes(resumes.filter((r) => r.id !== deletingId));
    } catch (err) {
      alert(`Error deleting resume: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="resume-dashboard">
      <ConfirmModal
        isOpen={!!deletingId}
        title="Delete Resume"
        message="Are you sure you want to delete this resume? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setDeletingId(null)}
      />

      {/* Header banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.75rem', color: '#0f172a' }}>
            Welcome back, {user?.name || 'Developer'}! 👋
          </h2>
          <p style={{ margin: '0.25rem 0 0 0', color: '#64748b' }}>
            Manage and tailor your professional resumes. Total Resumes: <strong>{resumes.length}</strong>
          </p>
        </div>

        <button
          onClick={() => navigate('/resume/new')}
          style={{
            backgroundColor: '#2563eb',
            color: '#fff',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '6px',
            fontWeight: 'bold',
            fontSize: '1rem',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)'
          }}
        >
          + Create New Resume
        </button>
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {[1, 2, 3].map((n) => (
            <div key={n} style={{ padding: '1.5rem', borderRadius: '8px', background: '#e2e8f0', height: '180px', animation: 'pulse 1.5s infinite' }} />
          ))}
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#dc2626', backgroundColor: '#fef2f2', borderRadius: '8px' }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>Error: {error}</p>
          <button onClick={fetchResumes} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>Retry</button>
        </div>
      ) : resumes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', border: '2px dashed #cbd5e1', borderRadius: '12px', backgroundColor: '#fff' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#1e293b' }}>You don't have any resumes yet.</h3>
          <p style={{ margin: '0 0 1.5rem 0', color: '#64748b' }}>Create your first resume to start tailoring with AI!</p>
          <button
            onClick={() => navigate('/resume/new')}
            style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Create Resume Now
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {resumes.map((resume) => (
            <div
              key={resume.id}
              style={{
                backgroundColor: '#fff',
                padding: '1.5rem',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between'
              }}
            >
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontSize: '1.15rem' }}>{resume.title}</h3>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1rem' }}>
                  Updated {new Date(resume.updatedAt).toLocaleDateString()}
                </p>

                {resume.skills && resume.skills.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '1rem' }}>
                    {resume.skills.slice(0, 4).map((s, idx) => (
                      <span key={idx} style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '0.15rem 0.5rem', borderRadius: '12px', fontSize: '0.75rem' }}>
                        {s}
                      </span>
                    ))}
                    {resume.skills.length > 4 && (
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>+{resume.skills.length - 4} more</span>
                    )}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                <button
                  onClick={() => navigate(`/resume/${resume.id}/edit`)}
                  style={{ flex: 1, backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 500 }}
                >
                  Edit / Tailor
                </button>
                <button
                  onClick={() => setDeletingId(resume.id)}
                  style={{ backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', padding: '0.5rem 0.75rem', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
