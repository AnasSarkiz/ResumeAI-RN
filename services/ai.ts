// services/geminiService.ts
import axios from 'axios';
import { AIResumeInput } from '../types/resume';
import { isOnline as connectivityOnline } from './connectivity';

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

export class OfflineError extends Error {
  constructor(message = 'Offline: Internet connection is required for AI features') {
    super(message);
    this.name = 'OfflineError';
  }
}

/**
 * Generate a complete, self-contained HTML resume based on user inputs and design instructions.
 * Returns a valid HTML string (with <!DOCTYPE html>) suitable for WebView and PDF printing.
 */
export const generateFullHTMLResume = async (input: AIResumeInput): Promise<string> => {
  if (!connectivityOnline()) {
    throw new OfflineError();
  }
  const base = `You are a senior resume designer and front‑end engineer.
Create ONE complete, production‑ready resume as a single self‑contained HTML document suitable for WebView and PDF export.

Hard rules (must follow exactly):
- Return ONLY raw HTML. No markdown, no code fences, no explanations.
- Self‑contained only: inline <style>; no external CSS, JS, fonts, or images.
- A4 pages with automatic pagination:
  - @page { size: A4; margin: 15mm; }
  - Use a <div class="page"> wrapper for EACH page. Size each .page for A4 (width 210mm; min-height 297mm).
  - If content overflows, CREATE a new <div class="page"> and continue content on the next page.
  - Ensure each page preserves the SAME background, spacing system, and overall design language.
  - Use print-safe CSS: -webkit-print-color-adjust: exact; print-color-adjust: exact.
- Valid, semantic HTML with accessible structure and consistent heading hierarchy.
- Absolutely NO placeholders like [X], {metric}, or lorem ipsum. If unsure, omit.

Content guidelines:
- Write achievement‑focused bullets using concise STAR‑style phrasing in 12–20 words.
- Use varied strong action verbs, avoid first‑person, and quantify realistically when context allows.
- Keep text ATS‑friendly: simple lists, clear section titles, avoid tables except for subtle layout.

Design guidelines:
- Modern, tasteful, professional; clearly readable in color and B/W.
- Establish a coherent type scale (headings vs body) and spacing system.
- Use a limited accent palette and optional layout features (e.g., gentle sidebar or two‑column sections) only if they improve clarity.
- Prefer CSS variables for colors/spacing for consistency.

User data (parse and render):
- Full Name: ${input.fullName}
- Email: ${input.email}
- Country Code: ${input.countryCode || ''}
- Phone: ${input.phone || ''}
- Date of Birth: ${input.dateOfBirth || ''}
- Country: ${input.country || ''}
- Links (newline‑separated, format: Label - URL):
${input.links || ''}
- Target Job Title: ${input.jobTitle || ''}
- Target Role: ${input.targetRole || ''}
- Industry: ${input.industry || ''}
- Summary: ${input.summary || ''}
- Experience entries (newline‑separated):
${input.experience || ''}
- Education entries (newline‑separated):
${input.education || ''}
- Skills (comma‑separated):
${input.skills || ''}

Parsing notes:
- Each EDUCATION line is one item: Degree — Institution (Years).
- Each EXPERIENCE line is one role: Role — Company (Dates) with 3–5 impact bullets inferred from text.
- Parse SKILLS by comma, dedupe, and render compactly (tags or inline list).

Design intent from user: ${input.designInstructions || 'Clean, modern, ATS‑friendly with tasteful accents.'}

Output exactly one COMPLETE HTML document with inline CSS that:
- Uses one or more <div class="page"> wrappers (one per A4 page) with 15mm margins enforced by @page.
- Includes a prominent header with name, contact, and labeled links.
- Includes sections (if data exists): Summary, Experience, Education, Skills.
- When content exceeds one page, continues on additional pages while maintaining the same background/design.
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

// /**
//  * Edit an existing full HTML resume using natural-language instructions.
//  * The model must return ONLY raw HTML (no markdown fences) and preserve A4/print-friendly structure.
//  */
export const editHTMLResume = async (
  currentHtml: string,
  instructions: string
): Promise<string> => {
  if (!connectivityOnline()) {
    throw new OfflineError();
  }
  const prompt = `You are a senior resume designer and front‑end engineer.
You will receive an existing COMPLETE, self‑contained HTML resume and a set of edit instructions.

Task:
- Apply the edits precisely and minimally. Preserve the existing visual identity unless changes are explicitly requested.
- Keep the output valid, self‑contained HTML for WebView/PDF. Do not add external resources.
- Preserve and enforce A4 / print rules (e.g., @page { size: A4; margin: 15mm; }, print‑color‑adjust exact) and use automatic pagination across MULTIPLE A4 pages when content overflows.
- Use a <div class="page"> wrapper for EACH page; size each .page for A4 (width 210mm; min‑height 297mm). Continue content on new .page blocks as needed.
- Maintain semantic markup, accessibility, and consistent heading hierarchy.
- Do NOT invent or hallucinate content. Only reword, restructure, or add content clearly implied by the instructions.

Add/Rewrite policy:
- When the instruction says "add":
  - Insert the new content in the most appropriate section (e.g., Summary, Experience role, Education, Skills). Create the section only if it clearly should exist.
  - If the user provides exact text, insert it verbatim unless they also say to "polish" or "reword".
  - Keep additions concise and impact‑oriented. Bullets should be 12–20 words.
- When the instruction says "rewrite" or "reword":
  - Replace the specified text with a clearer, more concise version that preserves meaning and professional tone.
  - Improve action verbs and quantify realistically if context permits; avoid adding new facts.
- If the edit risks breaking the single‑page A4 fit, FIRST tighten spacing/typography; if still overflowing, summarize or reduce less‑critical bullets instead of spilling to a second page.
- Resolve vague locations by choosing the best‑matching section/role heading. Respect indices (e.g., "Experience #2 bullet 3").

Design edit policy:
- When asked to change visual design (colors, spacing, typography, layout):
  - Stay self‑contained and ATS‑friendly; use system fonts or stack (e.g., -apple-system, Segoe UI, Roboto, Arial, sans-serif). No external fonts.
  - You may adjust color palette, spacing scale, borders/dividers, and type scale to improve clarity.
  - Keep or minimally adapt existing class names/structure to avoid breaking selectors unless a restructure is explicitly requested.
  - Layout changes (e.g., two‑column, sidebar) are allowed only if they remain readable in print and paginate cleanly across multiple A4 pages.
  - Avoid heavy backgrounds/images; prefer subtle CSS (gradients, rules, simple shapes). Use Unicode icons or pure CSS only.
  - Always maintain one or more <div class="page"> wrappers (one per A4 page) and print CSS (@page A4 with margins, print‑color‑adjust exact). Ensure all pages share the SAME background/design.

Strict output:
- Return ONLY the final raw HTML. No markdown, no backticks, no comments.
- Include <!DOCTYPE html> at the top.
- Inline <style> only.

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
