import { useState, useEffect } from 'react';

export default function SkillsSection({ resume, onSave, isLoading }) {
  const [skillsText, setSkillsText] = useState(
    Array.isArray(resume?.skills) ? resume.skills.join(', ') : ''
  );
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (Array.isArray(resume?.skills)) {
      setSkillsText(resume.skills.join(', '));
    }
  }, [resume?.skills]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const skillsArray = skillsText
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    try {
      await onSave({ skills: skillsArray });
      setMessage('Skills updated successfully.');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert(`Error saving skills: ${err.message}`);
    }
  };

  return (
    <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
      <h3 style={{ marginTop: 0, marginBottom: '1rem', color: '#1e293b' }}>Skills</h3>
      
      {message && <div style={{ padding: '0.5rem', marginBottom: '1rem', background: '#f0fdf4', color: '#15803d', borderRadius: '4px' }}>{message}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }} htmlFor="skills-input">
            Skills (Comma-separated)
          </label>
          <input
            id="skills-input"
            type="text"
            value={skillsText}
            onChange={(e) => setSkillsText(e.target.value)}
            placeholder="React, Node.js, Express, PostgreSQL, Prisma, Tailwind CSS, Git"
            style={{ width: '100%', padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '4px', boxSizing: 'border-box' }}
            disabled={isLoading}
          />
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
          {skillsText.split(',').map((skill, index) => {
            const trimmed = skill.trim();
            if (!trimmed) return null;
            return (
              <span
                key={index}
                style={{
                  backgroundColor: '#e0f2fe',
                  color: '#0369a1',
                  padding: '0.25rem 0.6rem',
                  borderRadius: '16px',
                  fontSize: '0.85rem',
                  fontWeight: 500
                }}
              >
                {trimmed}
              </span>
            );
          })}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '4px', cursor: isLoading ? 'not-allowed' : 'pointer' }}
        >
          {isLoading ? 'Saving...' : 'Save Skills'}
        </button>
      </form>
    </div>
  );
}
