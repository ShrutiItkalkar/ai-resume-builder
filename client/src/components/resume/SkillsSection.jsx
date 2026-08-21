import { useState, useEffect } from 'react';
import { Wrench, Save, Check, X, Plus } from 'lucide-react';

export default function SkillsSection({ resume, onSave, isLoading }) {
  const [skillsText, setSkillsText] = useState(
    Array.isArray(resume?.skills) ? resume.skills.join(', ') : ''
  );
  const [newSkill, setNewSkill] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (Array.isArray(resume?.skills)) {
      setSkillsText(resume.skills.join(', '));
    }
  }, [resume?.skills]);

  const skillsList = skillsText
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    const updated = Array.from(new Set([...skillsList, newSkill.trim()]));
    setSkillsText(updated.join(', '));
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    const updated = skillsList.filter((s) => s !== skillToRemove);
    setSkillsText(updated.join(', '));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSavedSuccess(false);
    try {
      await onSave({ skills: skillsList });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      alert(`Error saving skills: ${err.message}`);
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E9E6F2',
        padding: '2rem',
        boxShadow: '0 2px 4px rgba(23, 21, 31, 0.03)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid #F8F7FC', paddingBottom: '1rem' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#F3F0FF', color: '#7C5CFC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Wrench size={20} />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '700', color: '#17151F' }}>
            Technical & Professional Skills
          </h3>
          <p style={{ margin: '0.1rem 0 0 0', fontSize: '0.8rem', color: '#6B6875' }}>
            Add relevant technical skills, frameworks, tools, and methodologies.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div style={{ backgroundColor: '#F0FDF4', color: '#22C55E', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>
          <Check size={16} /> Skills updated successfully!
        </div>
      )}

      {/* Add Single Skill Row */}
      <form onSubmit={handleAddSkill} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          placeholder="Add a new skill (e.g. TypeScript, Docker, GraphQL)..."
          disabled={isLoading}
          style={{ flex: 1 }}
        />
        <button type="submit" className="btn-secondary" disabled={isLoading || !newSkill.trim()}>
          <Plus size={16} /> Add Skill
        </button>
      </form>

      {/* Skills Pills List */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem', minHeight: '40px' }}>
        {skillsList.length === 0 ? (
          <p style={{ fontSize: '0.85rem', color: '#9CA3AF', fontStyle: 'italic' }}>No skills added yet.</p>
        ) : (
          skillsList.map((skill, index) => (
            <span
              key={index}
              style={{
                backgroundColor: '#F3F0FF',
                color: '#7C5CFC',
                border: '1px solid #E9E6F2',
                padding: '0.35rem 0.75rem',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: '600',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              {skill}
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  color: '#9B8AFB',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <X size={14} />
              </button>
            </span>
          ))
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={handleSubmit} className="btn-primary" disabled={isLoading}>
          <Save size={16} />
          {isLoading ? 'Saving...' : 'Save Skills'}
        </button>
      </div>
    </div>
  );
}
