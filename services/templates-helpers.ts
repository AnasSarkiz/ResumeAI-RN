import { ManualResumeInput } from '../types/resume';

export const escape = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export const renderContact = (r: ManualResumeInput) => `
  <div class="contact">
    <span>${escape(r.email)}</span>
    ${r.phone ? `<span>• ${escape(r.phone)}</span>` : ''}
    ${r.linkedIn ? `<span>• LinkedIn: ${escape(r.linkedIn)}</span>` : ''}
    ${r.github ? `<span>• GitHub: ${escape(r.github)}</span>` : ''}
    ${r.website ? `<span>• ${escape(r.website)}</span>` : ''}
  </div>`;

export const renderExperience = (r: ManualResumeInput) => `
  ${r.experience
    .map(
      (e) => `
    <div class="item">
      <div class="role">${escape(e.jobTitle)}</div>
      <div class="meta">${escape(e.company)}${e.location ? ` • ${escape(e.location)}` : ''}</div>
      <div class="date">${escape(e.startDate)} - ${escape(e.endDate || 'Present')}</div>
      ${e.description?.length ? `<ul>${e.description.map((d) => `<li>${escape(d)}</li>`).join('')}</ul>` : ''}
    </div>`
    )
    .join('')}
`;

export const renderEducation = (r: ManualResumeInput) => `
  ${r.education
    .map(
      (e) => `
    <div class="item">
      <div class="degree">${escape(e.degree)}${e.fieldOfStudy ? ` in ${escape(e.fieldOfStudy)}` : ''}</div>
      <div class="meta">${escape(e.institution)}</div>
      <div class="date">${escape(e.startDate)} - ${escape(e.endDate || 'Present')}</div>
      ${e.description ? `<p>${escape(e.description)}</p>` : ''}
    </div>`
    )
    .join('')}
`;

export const renderSkills = (r: ManualResumeInput) => `
  <div class="chips">
    ${r.skills.map((s) => `<span class="chip">${escape(s.name)}${s.proficiency ? ` (${escape(s.proficiency)})` : ''}</span>`).join('')}
  </div>
`;

// Common A4 print styles
export const A4_STYLES = `
  @page { size: A4; margin: 15mm; }
  html, body { margin: 0; padding: 0; }
  * { box-sizing: border-box; }
  /* One wrapper per A4 page */
  .page { width: 210mm; min-height: 297mm; padding: 15mm; position: relative; }
  .page + .page { page-break-before: always; }
  @media print {
    .page { break-inside: avoid; }
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }
`;
