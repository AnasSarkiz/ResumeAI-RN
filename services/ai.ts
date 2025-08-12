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
  dateOfBirth?: string;
  country?: string;
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
  const base = `You are a senior resume designer and front-end stylist.
Create a COMPLETE, PRODUCTION-READY resume as a single HTML document suitable for WebView and PDF export.

Strict requirements:
- Return ONLY raw HTML. Do NOT include markdown code fences.
- The HTML must be self-contained (inline <style>, no external links or fonts).
- Use responsive, print-friendly CSS with A4-focused layout.
- Include explicit print CSS to enforce A4:
  - @page { size: A4; margin: 12mm; }
  - html, body width: 210mm; main content min-height: 297mm.
  - Wrap content in <div class="page"> sized for A4.
  - Preserve colors in print: -webkit-print-color-adjust: exact; print-color-adjust: exact.
- Use semantic structure, accessible markup, and consistent heading hierarchy.
- Absolutely NO placeholders like [X] or {metric}. If unsure, omit rather than fabricate.

Voice and content:
- Write powerful, achievement-driven text with clear outcomes, scope, and impact.
- Prefer STAR-style bullets (Situation-Task-Action-Result) distilled to a single, punchy sentence.
- Quantify results realistically (%, $, time saved, scale) when context allows; avoid exaggeration.
- Keep bullets concise (12–22 words), vary strong action verbs, avoid first-person.

Design & creativity:
- Produce a tasteful, modern visual design while remaining ATS-friendly.
- Use a refined typographic system (e.g., headings vs body, consistent sizes/weights, letter-spacing for headings).
- Employ a limited color palette with subtle accents for headings, rules, or icons (ensure legible in B/W print).
- Consider optional layout features when appropriate: subtle sidebar, balanced two-column sections, section dividers, timeline accents.
- Use CSS variables for colors/spacing to keep styling coherent.

User Info:
- Full Name: ${input.fullName}
- Email: ${input.email}
- Country Code: ${input.countryCode || ''}
- Phone: ${input.phone || ''}
- Date of Birth: ${input.dateOfBirth || ''}
- Country: ${input.country || ''}
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

Data parsing notes:
- Treat each EDUCATION line as one item: Degree — Institution (Years).
- Treat each EXPERIENCE line as one role: Role — Company (Dates) with 3–6 impact bullets inferred from text.
- Parse SKILLS by comma, dedupe and render cleanly (tags or compact list).

Design instructions from user: ${input.designInstructions || 'Clean, modern, ATS-friendly with tasteful accents.'}

Output:
 \n Provide full HTML code with inline CSS.\nIncorporate subtle but high-quality design details (gradients, borders, dividers, creative section titles, background accents, icons if simple.\nThink outside the box—experiment with vertical text, rotated elements, oversized headings, two-tone backgrounds, iconography, or minimalist geometric shapes.
- A visually distinctive but professional resume in a single HTML file with inline CSS.
- Sections: Summary, Experience, Education, Skills when content exists.
- Top contact block: prominent name, then email/phone (with country code), and LINKS as labeled anchors.
- Ensure the final HTML adheres to A4 rules and uses the <div class="page"> wrapper.
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
- Start with strong action verbs and vary verbs across bullets.
- Use STAR thinking; focus on outcomes, scope, key technologies, and measurable impact.
- Include realistic metrics (%/$/time/scale) when possible; never use placeholders.
- Be concise (12–22 words) and specific; remove fluff.
- Output plain sentences only (no list markers or markdown).
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
  const prompt = `Rewrite the following text to be more impactful, concise, and resume-ready.

Rules:
- Use professional tone and active voice.
- Prefer outcomes and metrics where appropriate.
- Avoid first-person and filler words.

Text:
"${text}"`;
  const result = await callGemini(prompt);
  return result || text;
};

export const generateCoverLetter = async (
  resume: Resume,
  company?: string,
  position?: string
): Promise<string> => {
  const prompt = `Write a professional, results-focused cover letter for the following resume targeting ${
    position ? `the ${position} position` : 'a job'
  }${company ? ` at ${company}` : ''}. Here's the resume data:

Name: ${resume.fullName}
Email: ${resume.email}
Experience: ${resume.experience.map((exp) => `${exp.jobTitle} at ${exp.company}`).join(', ')}
Education: ${resume.education.map((edu) => `${edu.degree} from ${edu.institution}`).join(', ')}
Skills: ${resume.skills.map((skill) => skill.name).join(', ')}

Requirements:
- 3–4 concise paragraphs (intro, 1–2 value paragraphs, closing call-to-action).
- Tailor to the role/company; emphasize relevant achievements and quantified outcomes.
- Use professional tone, no placeholders, no first-person pronouns overuse.
`;

  return await callGemini(prompt);
};

export const tailorResume = async (resume: Resume, jobDescription: string): Promise<Resume> => {
  const prompt = `Optimize the following resume for this job description:
${jobDescription}

Rules:
- Keep the exact JSON schema of the project's Resume interface; do not add unknown fields.
- Improve wording for impact and clarity; prioritize relevant skills and achievements.
- Reorder experiences and skills for best fit; keep dates and facts realistic.
- Add realistic, non-placeholder metrics only if implied by context; otherwise omit.

Current resume JSON:
${JSON.stringify(resume, null, 2)}

Return ONLY the optimized resume JSON.`;

  const text = await callGemini(prompt);
  try {
    return JSON.parse(text);
  } catch (err) {
    console.error('Failed to parse Gemini JSON response:', err);
    return resume;
  }
};

export const improveSummary = async (summary: string): Promise<string> => {
  const prompt = `Improve this resume summary to be more compelling, keyword-rich, and concise (2–3 sentences).

Guidelines:
- Lead with role/years/value proposition; follow with core strengths and differentiators.
- Use industry keywords naturally (no buzzword stuffing).
- Maintain professional tone; avoid first-person.

Summary:
"${summary}"`;
  const result = await callGemini(prompt);
  return result || summary;
};

/**
 * Edit an existing full HTML resume using natural-language instructions.
 * The model must return ONLY raw HTML (no markdown fences) and preserve A4/print-friendly structure.
 */
export const editHTMLResume = async (
  currentHtml: string,
  instructions: string
): Promise<string> => {
  const prompt = `You are a senior resume designer and front-end engineer.
You will receive an existing COMPLETE resume as a single self-contained HTML document and a set of edit instructions.

Your task:
- Apply the requested edits precisely and tastefully.
- Keep the document as valid, self-contained HTML suitable for WebView and PDF export.
- Preserve A4/print settings already present (e.g., @page size A4, print color adjust, page container sizes) and global structure.
- Maintain semantic markup, accessibility, and consistent design language.
- Do not invent data; only reword/restructure or add elements explicitly implied by instructions.

Strict output requirements:
- Return ONLY the final raw HTML (no markdown, no backticks, no commentary).
- Include <!DOCTYPE html> at the top.
- Keep it self-contained with inline <style> only (no external fonts/links).

Edit instructions:
"""
${instructions?.trim() || ''}
"""

Current HTML:
"""
${currentHtml}
"""`;

  const result = await callGemini(prompt);
  // Clean potential markdown code fences like ```html ... ```
  const cleaned = (result || '').replace(/```[a-zA-Z]*\n?|\n?```/g, '').trim();
  if (!cleaned) return currentHtml;
  const hasDoctype = /<!DOCTYPE\s+html/i.test(cleaned);
  const hasHtmlTag = /<html[\s>]/i.test(cleaned);
  if (hasHtmlTag) {
    return hasDoctype ? cleaned : `<!DOCTYPE html>\n${cleaned}`;
  }
  // If the model returned only a fragment, wrap safely
  return `<!DOCTYPE html>\n<html><head><meta name="viewport" content="width=device-width, initial-scale=1" /></head><body>${cleaned}</body></html>`;
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
