// services/geminiService.ts
import axios from 'axios';
import { Resume } from '../types/resume';

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const MODEL = 'gemini-2.0-flash-lite';

const callGemini = async (prompt: string): Promise<string> => {
  try {
    const response = await axios.post(
      `${BASE_URL}/${MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  } catch (error: any) {
    console.error('Gemini API error:', error.response?.data || error.message);
    return '';
  }
};

// Remove markdown bullets/syntax and placeholder brackets from AI output
const sanitizeBullet = (line: string): string => {
  let s = line.trim();
  // Remove leading list tokens: -, *, •, or numbers like 1.
  s = s.replace(/^(\s*[\-*•]+\s+|\s*\d+\.\s+)/, '');
  // Remove bold/italic/backticks
  s = s.replace(/\*\*([^*]+)\*\*/g, '$1'); // **bold**
  s = s.replace(/__([^_]+)__/g, '$1'); // __bold__
  s = s.replace(/\*([^*]+)\*/g, '$1'); // *italic*
  s = s.replace(/_([^_]+)_/g, '$1'); // _italic_
  s = s.replace(/`([^`]+)`/g, '$1'); // `code`
  // Remove placeholder bracket content like [number], [quantifiable ...]
  s = s.replace(/\[[^\]]+\]/g, '').trim();
  // Collapse extra spaces
  s = s.replace(/\s{2,}/g, ' ');
  // Remove wrapping parentheses left by template text
  s = s.replace(/^\(|\)$/g, '');
  return s.trim();
};

export const generateBulletPoints = async (
  jobTitle: string,
  context: string
): Promise<string[]> => {
  let prompt: string;
  // Try to parse structured context to craft a richer prompt
  try {
    const parsed = JSON.parse(context);
    const resume = parsed?.resume || parsed; // support passing entire resume directly
    const targetId = parsed?.targetExperienceId;
    if (resume && typeof resume === 'object') {
      const fullName = resume.fullName || '';
      const summary = resume.summary || '';
      const skills = Array.isArray(resume.skills)
        ? resume.skills.map((s: any) => s?.name).filter(Boolean).join(', ')
        : '';
      const experiences = Array.isArray(resume.experience) ? resume.experience : [];
      const targetExp = experiences.find((e: any) => e?.id === targetId) || experiences[experiences.length - 1];
      const targetTitle = targetExp?.jobTitle || jobTitle;
      const targetCompany = targetExp?.company || '';
      const targetDesc = Array.isArray(targetExp?.description) ? targetExp.description.join(' | ') : '';

      const previousHighlights = experiences
        .filter((e: any) => e && e !== targetExp)
        .map((e: any) => `${e.jobTitle || ''} at ${e.company || ''}`.trim())
        .filter(Boolean)
        .slice(0, 5)
        .join('; ');

      prompt = `You are writing resume bullets for ${fullName}. Generate 5 high-impact, achievement-oriented bullet points for the role "${targetTitle}"${
        targetCompany ? ` at ${targetCompany}` : ''
      }.

User summary: ${summary}
Skills: ${skills}
Target experience current bullets (if any): ${targetDesc}
Other roles: ${previousHighlights}

Guidelines:
- Start with strong action verbs and quantify impact where possible.
- Focus on outcomes, metrics, scope, and technologies.
- Avoid markdown or list markers. Output plain sentences (no leading dashes or asterisks).
- Do not include placeholders like [number] or [metric]. Use realistic metrics if context allows.
`;
    } else {
      prompt = `Generate 5 professional bullet points for a resume based on the job title "${jobTitle}".
Here's some context about the user: ${context}. Make the points achievement-oriented and quantifiable where possible. Avoid markdown and placeholders.`;
    }
  } catch {
    prompt = `Generate 5 professional bullet points for a resume based on the job title "${jobTitle}".
Here's some context about the user: ${context}. Make the points achievement-oriented and quantifiable where possible. Avoid markdown and placeholders.`;
  }

  const text = await callGemini(prompt);
  return text
    .split('\n')
    .map((line) => sanitizeBullet(line))
    .filter((l) => l.length > 0);
};

export const rewordText = async (text: string): Promise<string> => {
  const prompt = `Rewrite the following text to sound more professional and polished for a resume: "${text}"`;
  const result = await callGemini(prompt);
  return result || text;
};

export const generateCoverLetter = async (
  resume: Resume,
  company?: string,
  position?: string
): Promise<string> => {
  const prompt = `Write a professional cover letter for the following resume targeting ${
    position ? `the ${position} position` : 'a job'
  }${company ? ` at ${company}` : ''}. Here's the resume data:

Name: ${resume.fullName}
Email: ${resume.email}
Experience: ${resume.experience.map((exp) => `${exp.jobTitle} at ${exp.company}`).join(', ')}
Education: ${resume.education.map((edu) => `${edu.degree} from ${edu.institution}`).join(', ')}
Skills: ${resume.skills.map((skill) => skill.name).join(', ')}

Make the cover letter concise (3-4 paragraphs), tailored to the position, and highlight relevant experience and skills.`;

  return await callGemini(prompt);
};

export const tailorResume = async (resume: Resume, jobDescription: string): Promise<Resume> => {
  const prompt = `Optimize the following resume for this job description: ${jobDescription}.

Current resume:
${JSON.stringify(resume, null, 2)}

Return the optimized resume in the exact same JSON format, with improved wording, reordered sections if needed, and emphasis on relevant skills and experience.`;

  const text = await callGemini(prompt);
  try {
    return JSON.parse(text);
  } catch (err) {
    console.error('Failed to parse Gemini JSON response:', err);
    return resume;
  }
};

export const improveSummary = async (summary: string): Promise<string> => {
  const prompt = `Improve this resume summary to be more compelling and professional: "${summary}"`;
  const result = await callGemini(prompt);
  return result || summary;
};
