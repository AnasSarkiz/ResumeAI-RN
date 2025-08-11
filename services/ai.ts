// services/geminiService.ts
import axios from 'axios';
import { Resume } from '../types/resume';
import type { TemplateId } from './templates';

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

// New: Multi-step AI HTML generator input and function
export interface AIGeneratorInput {
  fullName: string;
  email: string;
  countryCode?: string;
  phone?: string;
  links?: string; // newline-separated entries like "Label - URL"
  summary?: string;
  jobTitle?: string;
  experience?: string; // free-text experience
  education?: string; // free-text education
  skills?: string; // comma-separated skills
  targetRole?: string;
  industry?: string;
  designInstructions?: string; // user style guidance
}

/**
 * Generate a complete, self-contained HTML resume based on user inputs and design instructions.
 * Returns a valid HTML string (with <!DOCTYPE html>) suitable for WebView and PDF printing.
 */
export const generateFullHTMLResume = async (input: AIGeneratorInput): Promise<string> => {
  const base = `You are a professional resume designer and front-end developer.
Create a COMPLETE, PRODUCTION-READY resume as a single HTML document for printing and PDF export.

Strict requirements:
- Return ONLY raw HTML. Do NOT include markdown code fences.
- The HTML must be self-contained (inline <style> with fonts, no external links).
- Use responsive, print-friendly CSS with A4-focused layout.
- Include explicit print CSS to enforce A4:
  - Use @page { size: A4; margin: 12mm; }
  - Ensure html/body width is 210mm; content area has min-height 297mm.
  - Wrap all content in a single <div class="page"> that is 210mm wide and min-height 297mm.
  - Preserve colors in print: -webkit-print-color-adjust: exact; print-color-adjust: exact.
- Use semantic structure and accessible markup.
- Do not fabricate impossible claims; if data is sparse, keep it professional and concise.

User Info:
- Full Name: ${input.fullName}
- Email: ${input.email}
- Country Code: ${input.countryCode || ''}
- Phone: ${input.phone || ''}
- Links (newline-separated, format: Label - URL):
${input.links || ''}
- Target Job Title: ${input.jobTitle || ''}
- Target Role: ${input.targetRole || ''}
- Industry: ${input.industry || ''}
- Summary: ${input.summary || ''}
- Experience entries (newline-separated):
${input.experience || ''}
- Education entries (newline-separated):
${input.education || ''}
- Skills (comma-separated):
${input.skills || ''}

Data format notes:
- Treat each EDUCATION line as one education item: Degree — Institution (Years).
- Treat each EXPERIENCE line as one role item: Role — Company (Dates), followed by bullet achievements inferred from the text.
- Parse SKILLS by comma and render as a clean, compact list (or inline tags) without duplicates.

Design Instructions from user: ${input.designInstructions || 'Clean, professional, ATS-friendly.'}

Output:
- A beautiful, modern resume in a single HTML file with inline CSS.
- Include sections for Summary, Experience, Education, and Skills when content is provided.
- Include a contact area at the top: name prominently, then email, phone (with country code if provided), and render LINKS as clickable anchors with the provided labels.
- Ensure typography, spacing, and headings are polished. Avoid placeholders like [X].
 - Ensure the final HTML adheres to the A4 rules above and uses the <div class="page"> wrapper.
`;

  try {
    const raw = await callGemini(base);
    const cleaned = (raw || '').replace(/```[a-zA-Z]*\n?|\n?```/g, '').trim();
    // Basic sanity: ensure it looks like HTML
    const hasDoctype = /<!DOCTYPE\s+html/i.test(cleaned);
    const hasHtmlTag = /<html[\s>]/i.test(cleaned);
    if (hasHtmlTag) {
      return hasDoctype ? cleaned : `<!DOCTYPE html>\n${cleaned}`;
    }
    // Fallback minimal wrapper if model returned body fragment
    return `<!DOCTYPE html>\n<html><head><meta name="viewport" content="width=device-width, initial-scale=1" /></head><body>${cleaned}</body></html>`;
  } catch (e) {
    console.error('Failed to generate full HTML resume:', e);
    // Provide a minimal fallback so UI does not break
    return `<!DOCTYPE html>\n<html><head><meta name="viewport" content="width=device-width, initial-scale=1" /><style>body{font-family:sans-serif;padding:32px;}</style></head><body><h1>${input.fullName}</h1><p>${input.summary || ''}</p></body></html>`;
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

// New function to generate complete CVs with different designs
export interface CVTemplate {
  id: string;
  name: string;
  description: string;
  preferredTemplate?: TemplateId;
  resume: Resume;
}

export interface UserInputFields {
  fullName: string;
  email: string;
  phone?: string;
  summary?: string;
  jobTitle?: string;
  experience?: string;
  education?: string;
  skills?: string;
  targetRole?: string;
  industry?: string;
}

export const generateThreeCVDesigns = async (userInput: UserInputFields): Promise<CVTemplate[]> => {
  const basePrompt = `You are an expert resume writer and CV designer.

Goal: Generate 3 DISTINCT, high-quality resume variants based on the user's input. Each variant must be realistic, achievement-oriented, and tailored to a slightly different presentation style.

User Information:
- Full Name: ${userInput.fullName}
- Email: ${userInput.email}
- Phone: ${userInput.phone || 'Not provided'}
- Professional Summary: ${userInput.summary || 'Not provided'}
- Current/Target Job Title: ${userInput.jobTitle || 'Not provided'}
- Experience Details: ${userInput.experience || 'Not provided'}
- Education Details: ${userInput.education || 'Not provided'}
- Skills: ${userInput.skills || 'Not provided'}
- Target Role: ${userInput.targetRole || 'Not provided'}
- Industry: ${userInput.industry || 'Not provided'}

Variants to produce (use these as directional styles):
1) Professional & Traditional — corporate-friendly, concise, strong fundamentals.
2) Modern & Impactful — contemporary tone, clear outcomes and value.
3) Technical & Detailed — skill-forward, deeper technical scope and metrics.

Strict Requirements:
- DO NOT use placeholders like [X], [metric], [company], or {variable}. Use realistic, context-appropriate values. If uncertain, omit the metric rather than inserting placeholders.
- Use strong action verbs and quantify impact when plausible (%, $, time saved, scale), without fabricating impossible details.
- Keep bullets concise and results-focused. Avoid first-person.
- Ensure each variant feels DIFFERENT in emphasis, tone, and section ordering.
- Use professional language and consistent tense/formatting within each experience.
- If user inputs are sparse, infer reasonable defaults while staying realistic.

Output Format:
Return ONLY a valid JSON array with exactly 3 objects. Each object MUST have:
{
  "id": "template_1|template_2|template_3",           // stable ids for the three variants
  "name": "Short descriptive name",
  "description": "1-2 sentence summary of the approach",
  "preferredTemplate": "classic|modern|elegant|sidebar|timeline", // choose the best fit from these options ONLY
  "resume": {
    // Complete Resume object matching the project's Resume interface
    // Required fields: fullName, email, (optional phone), summary,
    // experience[] (2-3 roles, each with jobTitle, company, startDate, endDate or current, description[3-6]),
    // education[] (1-2 items), skills[] (8-12 items, include categories when reasonable)
  }
}
`;

  try {
    const response = await callGemini(basePrompt);
    const cleanedResponse = response.replace(/```json\n?|\n?```/g, '').trim();
    const templates = JSON.parse(cleanedResponse);
    
    // Ensure each template has proper IDs and structure
    return templates.map((template: any, index: number) => ({
      ...template,
      id: template.id || `template_${index + 1}`,
      resume: {
        ...template.resume,
        id: `resume_${Date.now()}_${index}`,
        userId: '', // Will be set when user selects
        title: `${userInput.fullName}'s Resume - ${template.name}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    }));
  } catch (error) {
    console.error('Failed to generate CV templates:', error);
    // Fallback to generating a single basic template
    return generateFallbackTemplates(userInput);
  }
};

const generateFallbackTemplates = (userInput: UserInputFields): CVTemplate[] => {
  const baseResume = {
    id: `resume_${Date.now()}`,
    userId: '',
    title: `${userInput.fullName}'s Resume`,
    fullName: userInput.fullName,
    email: userInput.email,
    phone: userInput.phone,
    summary: userInput.summary || `Professional ${userInput.jobTitle || 'professional'} with expertise in ${userInput.industry || 'various fields'}.`,
    experience: userInput.experience ? [{
      id: `exp_${Date.now()}`,
      jobTitle: userInput.jobTitle || 'Professional',
      company: 'Previous Company',
      startDate: '2020',
      endDate: '2024',
      current: false,
      description: [userInput.experience]
    }] : [],
    education: userInput.education ? [{
      id: `edu_${Date.now()}`,
      institution: 'University',
      degree: userInput.education,
      startDate: '2016',
      endDate: '2020',
      current: false
    }] : [],
    skills: userInput.skills ? userInput.skills.split(',').map((skill, index) => ({
      id: `skill_${index}`,
      name: skill.trim(),
      proficiency: 'intermediate' as const
    })) : [],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  return [
    {
      id: 'template_1',
      name: 'Professional',
      description: 'Clean and traditional format',
      resume: { ...baseResume, id: `resume_${Date.now()}_1` }
    },
    {
      id: 'template_2', 
      name: 'Modern',
      description: 'Contemporary design with impact focus',
      resume: { ...baseResume, id: `resume_${Date.now()}_2` }
    },
    {
      id: 'template_3',
      name: 'Detailed',
      description: 'Comprehensive skill-focused approach',
      resume: { ...baseResume, id: `resume_${Date.now()}_3` }
    }
  ];
};
