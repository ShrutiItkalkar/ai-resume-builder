import { useAuth } from '../../context/AuthContext';

export default function ResumePreview({ resume }) {
  const { user } = useAuth();

  if (!resume) return null;

  const userEmail = user?.email || 'user@example.com';
  const userName = user?.name || 'Candidate Name';

  return (
    <div
      className="resume-preview-container"
      style={{
        backgroundColor: '#ffffff',
        color: '#1e293b',
        padding: '2.5rem 3rem',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        maxWidth: '800px',
        margin: '0 auto',
        boxSizing: 'border-box'
      }}
    >
      {/* Header */}
      <header style={{ textAlign: 'center', paddingBottom: '1.25rem', borderBottom: '2px solid #0f172a', marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.025em', color: '#0f172a' }}>
          {userName}
        </h1>
        <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.95rem', color: '#475569' }}>
          {userEmail} &bull; {resume.title}
        </p>
      </header>

      {/* Professional Summary */}
      {resume.summary && (
        <section style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0f172a', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.25rem', marginBottom: '0.5rem' }}>
            Professional Summary
          </h3>
          <p style={{ margin: 0, fontSize: '0.925rem', lineHeight: '1.6', color: '#334155' }}>
            {resume.summary}
          </p>
        </section>
      )}

      {/* Skills */}
      {Array.isArray(resume.skills) && resume.skills.length > 0 && (
        <section style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0f172a', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.25rem', marginBottom: '0.5rem' }}>
            Technical & Professional Skills
          </h3>
          <p style={{ margin: 0, fontSize: '0.925rem', color: '#334155', lineHeight: '1.5' }}>
            <strong>Skills:</strong> {resume.skills.join(' • ')}
          </p>
        </section>
      )}

      {/* Work Experience */}
      {Array.isArray(resume.experiences) && resume.experiences.length > 0 && (
        <section style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0f172a', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.25rem', marginBottom: '0.75rem' }}>
            Work Experience
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {resume.experiences.map((exp) => (
              <div key={exp.id || exp.company}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.975rem', color: '#0f172a' }}>
                    {exp.role} &ndash; <span style={{ fontWeight: 500, color: '#334155' }}>{exp.company}</span>
                  </span>
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    {exp.startDate} &ndash; {exp.endDate || 'Present'}
                  </span>
                </div>
                {exp.description && (
                  <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.9rem', lineHeight: '1.5', color: '#334155', whiteSpace: 'pre-line' }}>
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {Array.isArray(resume.education) && resume.education.length > 0 && (
        <section style={{ marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0f172a', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.25rem', marginBottom: '0.75rem' }}>
            Education
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {resume.education.map((edu) => (
              <div key={edu.id || edu.institution} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>{edu.degree}</span>
                  <div style={{ fontSize: '0.875rem', color: '#475569' }}>{edu.institution}</div>
                </div>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Class of {edu.graduationYear}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
