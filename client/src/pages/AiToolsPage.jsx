import { useNavigate } from 'react-router-dom';
import { Sparkles, FileText, Target, Lightbulb, Briefcase, Zap, ArrowRight } from 'lucide-react';

const tools = [
  {
    id: 'improve',
    icon: Sparkles,
    title: 'Improve Resume',
    description: 'Get AI-powered suggestions to enhance your resume content, tone, and impact.',
    color: '#7C5CFC',
    bg: 'var(--primary-light)',
    badge: 'Popular',
  },
  {
    id: 'summary',
    icon: FileText,
    title: 'Generate Summary',
    description: 'Craft a compelling professional summary tailored to your target role.',
    color: '#3B82F6',
    bg: 'rgba(59, 130, 246, 0.15)',
  },
  {
    id: 'ats',
    icon: Target,
    title: 'ATS Analysis',
    description: 'Analyze your resume against job descriptions to maximize ATS pass rate.',
    color: '#10B981',
    bg: 'rgba(16, 185, 129, 0.15)',
    badge: 'New',
  },
  {
    id: 'skills',
    icon: Lightbulb,
    title: 'Skill Suggestions',
    description: 'Discover in-demand skills for your industry and level to add to your profile.',
    color: '#F59E0B',
    bg: 'rgba(245, 158, 11, 0.15)',
  },
  {
    id: 'experience',
    icon: Briefcase,
    title: 'Experience Enhancement',
    description: 'Transform your job descriptions into powerful, achievement-driven bullet points.',
    color: '#EF4444',
    bg: 'rgba(239, 68, 68, 0.15)',
  },
  {
    id: 'keywords',
    icon: Zap,
    title: 'Keyword Optimizer',
    description: 'Identify and integrate the right keywords to pass recruiter filters.',
    color: '#8B5CF6',
    bg: 'rgba(139, 92, 246, 0.15)',
  },
];

export default function AiToolsPage() {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #7C5CFC 0%, #9B8AFB 60%, #A78BFA 100%)',
        borderRadius: '20px',
        padding: '2.5rem 2.75rem',
        color: '#FFFFFF',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem',
      }}>
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '20px',
            padding: '0.3rem 0.8rem', fontSize: '0.75rem', fontWeight: '700',
            marginBottom: '1rem',
          }}>
            <Sparkles size={13} />
            Powered by Gemini AI
          </div>
          <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.75rem', fontWeight: '800', letterSpacing: '-0.03em' }}>
            AI Career Assistant
          </h2>
          <p style={{ margin: 0, opacity: 0.85, fontSize: '0.95rem', maxWidth: '500px' }}>
            Use our suite of AI tools to optimize every section of your resume and land more interviews.
          </p>
        </div>
        <button
          onClick={() => navigate('/resume/new')}
          style={{
            backgroundColor: '#FFFFFF', color: '#7C5CFC', border: 'none',
            padding: '0.8rem 1.5rem', borderRadius: '10px', fontWeight: '700',
            fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          Start with a Resume
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Tools Grid */}
      <div>
        <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)' }}>
          Available Tools
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.25rem',
        }}>
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.id}
                style={{
                  backgroundColor: 'var(--card-bg)',
                  borderRadius: '16px',
                  border: '1px solid var(--border-color)',
                  padding: '1.5rem',
                  cursor: 'pointer',
                  transition: 'box-shadow 0.2s ease, transform 0.2s ease',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                onClick={() => navigate('/resume/new')}
              >
                {tool.badge && (
                  <span style={{
                    position: 'absolute', top: '1rem', right: '1rem',
                    backgroundColor: tool.color, color: '#fff',
                    fontSize: '0.65rem', fontWeight: '700', padding: '0.15rem 0.5rem',
                    borderRadius: '10px',
                  }}>
                    {tool.badge}
                  </span>
                )}

                <div style={{
                  width: '46px', height: '46px', borderRadius: '12px',
                  backgroundColor: tool.bg, color: tool.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '1rem',
                }}>
                  <Icon size={22} />
                </div>

                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: '700', color: 'var(--text-main)' }}>
                  {tool.title}
                </h4>
                <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.55' }}>
                  {tool.description}
                </p>

                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.3rem',
                  fontSize: '0.82rem', fontWeight: '600', color: tool.color,
                }}>
                  Try it <ArrowRight size={13} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Coming Soon */}
      <div style={{
        backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '16px',
        padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', gap: '1rem',
      }}>
        <div style={{
          width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'var(--primary-light)',
          color: '#7C5CFC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Zap size={20} />
        </div>
        <div>
          <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '0.9rem' }}>
            More AI tools coming soon
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: '0.2rem' }}>
            Cover letter generation, LinkedIn optimization, interview prep, and more are on the roadmap.
          </div>
        </div>
      </div>
    </div>
  );
}
