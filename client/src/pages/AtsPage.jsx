import { useState } from 'react';
import { Target, TrendingUp, CheckCircle2, AlertCircle, ChevronRight, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const suggestions = [
  { type: 'error', text: 'Add measurable achievements to your work experience (e.g., "Improved performance by 40%")' },
  { type: 'warning', text: 'Include more ATS-friendly keywords from your target job description' },
  { type: 'warning', text: 'Add a professional summary if you have not already' },
  { type: 'success', text: 'Skills section is well structured' },
  { type: 'success', text: 'Education section is complete and formatted correctly' },
  { type: 'error', text: 'Work experience descriptions are too short — aim for 3-5 bullet points per role' },
];

const categories = [
  { label: 'Keywords', score: 72, color: '#7C5CFC', bg: '#F3F0FF' },
  { label: 'Formatting', score: 88, color: '#10B981', bg: '#ECFDF5' },
  { label: 'Completeness', score: 65, color: '#F59E0B', bg: '#FFFBEB' },
  { label: 'Impact', score: 55, color: '#EF4444', bg: '#FEF2F2' },
];

function ScoreRing({ score }) {
  const radius = 80;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const progress = circumference - (score / 100) * circumference;
  const color = score >= 75 ? '#10B981' : score >= 50 ? '#F59E0B' : '#EF4444';

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={radius * 2} height={radius * 2} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={radius} cy={radius} r={normalizedRadius}
          fill="none" stroke="#E9E6F2" strokeWidth={stroke}
        />
        <circle
          cx={radius} cy={radius} r={normalizedRadius}
          fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={progress}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div style={{ position: 'absolute', textAlign: 'center' }}>
        <div style={{ fontSize: '2.25rem', fontWeight: '800', color: '#17151F', lineHeight: 1 }}>{score}</div>
        <div style={{ fontSize: '0.75rem', color: '#6B6875', fontWeight: '600' }}>/ 100</div>
      </div>
    </div>
  );
}

export default function AtsPage() {
  const navigate = useNavigate();
  const [overallScore] = useState(70);

  const getScoreLabel = (s) => s >= 80 ? 'Excellent' : s >= 65 ? 'Good' : s >= 50 ? 'Needs Work' : 'Poor';
  const getScoreColor = (s) => s >= 80 ? '#10B981' : s >= 65 ? '#F59E0B' : s >= 50 ? '#F97316' : '#EF4444';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

      {/* Score Overview */}
      <div style={{
        backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid #E9E6F2',
        padding: '2.5rem', display: 'flex', gap: '3rem', alignItems: 'center', flexWrap: 'wrap',
        boxShadow: '0 2px 8px rgba(23,21,31,0.04)',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <ScoreRing score={overallScore} />
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '0.85rem', fontWeight: '700', color: getScoreColor(overallScore),
              backgroundColor: getScoreColor(overallScore) + '18',
              padding: '0.25rem 0.75rem', borderRadius: '20px',
            }}>
              {getScoreLabel(overallScore)}
            </div>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: '240px' }}>
          <h2 style={{ margin: '0 0 0.4rem 0', fontSize: '1.4rem', fontWeight: '800', color: '#17151F' }}>
            ATS Compatibility Score
          </h2>
          <p style={{ margin: '0 0 1.75rem 0', color: '#6B6875', fontSize: '0.9rem' }}>
            Your resume scores <strong style={{ color: '#17151F' }}>{overallScore}/100</strong> for ATS compatibility. Follow the suggestions below to improve your score and get past applicant tracking systems.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              className="btn-primary"
              onClick={() => navigate('/resume/new')}
              style={{ padding: '0.65rem 1.25rem', fontSize: '0.875rem' }}
            >
              <FileText size={15} />
              Analyze a Resume
            </button>
            <button className="btn-secondary" style={{ padding: '0.65rem 1.25rem', fontSize: '0.875rem' }}>
              <Target size={15} />
              See Full Report
            </button>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div>
        <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '1.05rem', fontWeight: '700', color: '#17151F' }}>
          Score Breakdown
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
          {categories.map((cat) => (
            <div key={cat.label} style={{
              backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #E9E6F2',
              padding: '1.25rem 1.5rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#4B4855' }}>{cat.label}</span>
                <span style={{
                  fontSize: '0.9rem', fontWeight: '800', color: cat.color,
                  backgroundColor: cat.bg, padding: '0.15rem 0.6rem', borderRadius: '8px',
                }}>
                  {cat.score}%
                </span>
              </div>
              {/* Progress bar */}
              <div style={{ height: '6px', backgroundColor: '#F3F4F6', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${cat.score}%`, backgroundColor: cat.color,
                  borderRadius: '3px', transition: 'width 1s ease',
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggestions */}
      <div>
        <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '1.05rem', fontWeight: '700', color: '#17151F' }}>
          Improvement Suggestions
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {suggestions.map((s, idx) => {
            const isError = s.type === 'error';
            const isWarning = s.type === 'warning';
            const Icon = isError ? AlertCircle : isWarning ? TrendingUp : CheckCircle2;
            const color = isError ? '#EF4444' : isWarning ? '#F59E0B' : '#10B981';
            const bg = isError ? '#FEF2F2' : isWarning ? '#FFFBEB' : '#ECFDF5';
            const border = isError ? '#FCA5A5' : isWarning ? '#FCD34D' : '#6EE7B7';

            return (
              <div key={idx} style={{
                display: 'flex', alignItems: 'flex-start', gap: '0.9rem',
                backgroundColor: bg, border: `1px solid ${border}`,
                borderRadius: '12px', padding: '1rem 1.25rem',
              }}>
                <Icon size={18} style={{ color, flexShrink: 0, marginTop: '0.1rem' }} />
                <span style={{ fontSize: '0.875rem', color: '#374151', lineHeight: '1.5' }}>
                  {s.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div style={{
        background: 'linear-gradient(135deg, #F3F0FF 0%, #EFF6FF 100%)',
        border: '1px solid #E9E6F2', borderRadius: '16px',
        padding: '1.75rem 2rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem',
      }}>
        <div>
          <div style={{ fontWeight: '700', fontSize: '1rem', color: '#17151F', marginBottom: '0.3rem' }}>
            Ready to boost your score?
          </div>
          <div style={{ color: '#6B6875', fontSize: '0.85rem' }}>
            Apply AI suggestions to your resume and re-run the ATS analysis.
          </div>
        </div>
        <button
          className="btn-primary"
          onClick={() => navigate('/resumes')}
          style={{ padding: '0.7rem 1.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          Go to My Resumes <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
