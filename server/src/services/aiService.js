/**
 * Service wrapper for AI Resume Generation
 * Strictly executed backend-side. Never exposes keys to the client.
 */

async function generateResumeContent({ resume, jobDescription }) {
  const apiKey = process.env.AI_API_KEY || process.env.LLM_API_KEY || process.env.GEMINI_API_KEY;

  const targetJob = jobDescription || resume.jobDescription || 'Software Developer';
  const existingSkills = Array.isArray(resume.skills) ? resume.skills.join(', ') : '';
  const experiencesText = (resume.experiences || [])
    .map((e) => `${e.role} at ${e.company} (${e.startDate} - ${e.endDate || 'Present'}): ${e.description || ''}`)
    .join('\n');

  const prompt = `You are an expert ATS resume reviewer and career coach.
Analyze the candidate's current resume and tailor it specifically for the following job description.

Candidate Resume Title: ${resume.title}
Current Summary: ${resume.summary || 'N/A'}
Current Skills: ${existingSkills || 'N/A'}
Work Experiences:
${experiencesText || 'N/A'}

Target Job Description:
${targetJob}

Respond ONLY with a valid JSON object matching this exact structure without markdown formatting or code fences:
{
  "summary": "Tailored 2-3 sentence professional summary targeting the job description",
  "skills": ["Skill1", "Skill2", "Skill3", "Skill4", "Skill5", "Skill6"],
  "experiences": [
    {
      "role": "Role Title",
      "company": "Company Name",
      "tailoredBullets": [
        "Action verb + quantifiable achievement matching job requirements",
        "Bullet 2 highlighting relevant technologies"
      ]
    }
  ],
  "atsKeywords": ["Keyword1", "Keyword2", "Keyword3"],
  "suggestions": ["Suggestion 1", "Suggestion 2"]
}`;

  if (apiKey && apiKey !== 'we_will_add_this_in_milestone_6' && !apiKey.includes('your_ai_api_key')) {
    try {
      // Attempt Gemini REST API call
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: 'application/json' },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          const cleanedText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleanedText);
          return validateAndFormatAiOutput(parsed, resume, targetJob);
        }
      }
    } catch (err) {
      console.warn('External AI API call failed or timed out, falling back to structured generator:', err.message);
    }
  }

  // Fallback AI generation engine (Rule & NLP-assisted) for demonstration / offline environment
  return generateStructuredFallback({ resume, targetJob });
}

function validateAndFormatAiOutput(output, resume, targetJob) {
  return {
    summary: output.summary || `Results-oriented candidate tailoring skills for ${targetJob.slice(0, 50)}...`,
    skills: Array.isArray(output.skills) && output.skills.length > 0 ? output.skills : resume.skills || [],
    experiences: Array.isArray(output.experiences) ? output.experiences : [],
    atsKeywords: Array.isArray(output.atsKeywords) ? output.atsKeywords : ['Problem Solving', 'Teamwork'],
    suggestions: Array.isArray(output.suggestions) ? output.suggestions : ['Highlight metrics in bullet points'],
  };
}

function generateStructuredFallback({ resume, targetJob }) {
  // Extract keywords from job description
  const keywords = targetJob
    .split(/\W+/)
    .filter((w) => w.length > 4)
    .slice(0, 6);

  const matchedSkills = Array.from(
    new Set([...(resume.skills || []), ...keywords.slice(0, 4)])
  );

  const tailoredSummary = `Results-driven software professional experienced in ${matchedSkills.slice(0, 3).join(', ')}. Demonstrated track record of building reliable web applications and solving complex engineering problems aligned with key job requirements.`;

  const tailoredExperiences = (resume.experiences || []).map((exp) => ({
    id: exp.id,
    role: exp.role,
    company: exp.company,
    tailoredBullets: [
      `Architected and optimized features using ${matchedSkills[0] || 'modern tech stack'}, improving user response times.`,
      `Collaborated across cross-functional teams to deliver key technical milestones for ${exp.company}.`,
      `Leveraged ${matchedSkills[1] || 'best practices'} to streamline workflows and improve system reliability.`,
    ],
  }));

  return {
    summary: tailoredSummary,
    skills: matchedSkills,
    experiences: tailoredExperiences,
    atsKeywords: keywords.slice(0, 5),
    suggestions: [
      'Quantify results by adding percentage metrics to your bullet points.',
      'Ensure tech stack keywords match the target job description closely.',
    ],
  };
}

module.exports = { generateResumeContent };
