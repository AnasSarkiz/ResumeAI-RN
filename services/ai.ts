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

export const generateBulletPoints = async (
  jobTitle: string,
  context: string
): Promise<string[]> => {
  const prompt = `Generate 5 professional bullet points for a resume based on the job title "${jobTitle}". 
Here's some context about the user: ${context}. Make the points achievement-oriented and quantifiable where possible.`;

  const text = await callGemini(prompt);
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
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
