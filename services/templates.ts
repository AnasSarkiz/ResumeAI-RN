import { Resume } from '../types/resume';
import {layeredPaper,artDecoRevival} from './templates-part3';
import {circularOrbit,verticalRibbon} from './templates-part2';
export type TemplateId =
  | 'classic'
  | 'modern'
  | 'elegant'
  | 'sidebar'
  | 'timeline'
  | 'compactGrid'
  | 'creativeGradient'
  | 'futuristicDarkMode'
  | 'photoHeader'
  | 'softPastel'
  | 'minimalistColumns'
  | 'boldAccentLine'
  | 'splitBanner'
  | 'modernCardBlocks'
  | 'elegantMonochrome'
  | 'magazineEditorial'
  | 'infographicMinimal'
  | 'asymmetricLayout'
  | 'typographicEmphasis'
  | 'geometricMinimalism'
  | 'layeredPaper'
  | 'artDecoRevival'
  | 'circularOrbit'
  | 'verticalRibbon'
  | 'diagonalSplit'

export const TEMPLATE_NAMES: Record<TemplateId, string> = {
  classic: 'Classic Professional',
  modern: 'Modern Minimal',
  elegant: 'Elegant Serif',
  sidebar: 'Bold Sidebar',
  timeline: 'Timeline Focused',
  compactGrid: 'Compact Grid',
  creativeGradient: 'Creative Gradient',
  futuristicDarkMode: 'Futuristic Dark Mode',
  photoHeader: 'Photo Header',
  softPastel: 'Soft Pastel',
  minimalistColumns: 'Minimalist Columns',
  boldAccentLine: 'Bold Accent Line',
  splitBanner: 'Split Banner',
  modernCardBlocks: 'Modern Card Blocks',
  elegantMonochrome: 'Elegant Monochrome',
  magazineEditorial: 'Magazine Editorial',
  infographicMinimal: 'Infographic Minimal',
  asymmetricLayout: 'Asymmetric Layout',
  typographicEmphasis: 'Typographic Emphasis',
  geometricMinimalism: 'Geometric Minimalism',
  layeredPaper: 'Layered Paper',
  artDecoRevival: 'Art Deco Revival',
  circularOrbit: 'Circular Orbit',
  verticalRibbon: 'Vertical Ribbon',
  diagonalSplit: 'Diagonal Split',
};
const escape = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const renderContact = (r: Resume) => `
  <div class="contact">
    <span>${escape(r.email)}</span>
    ${r.phone ? `<span>• ${escape(r.phone)}</span>` : ''}
    ${r.linkedIn ? `<span>• LinkedIn: ${escape(r.linkedIn)}</span>` : ''}
    ${r.github ? `<span>• GitHub: ${escape(r.github)}</span>` : ''}
    ${r.website ? `<span>• ${escape(r.website)}</span>` : ''}
  </div>`;

const renderExperience = (r: Resume) => `
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

const renderEducation = (r: Resume) => `
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

const renderSkills = (r: Resume) => `
  <div class="chips">
    ${r.skills.map((s) => `<span class="chip">${escape(s.name)}${s.proficiency ? ` (${escape(s.proficiency)})` : ''}</span>`).join('')}
  </div>
`;

// 1) Classic Professional
const classic = (r: Resume) => `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  :root { --accent:#1f2937; --muted:#6b7280; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; margin:0; padding:40px; color:#111827; }
  .container { max-width: 800px; margin:0 auto; }
  h1 { margin:0; font-size:32px; letter-spacing:0.2px; }
  .contact { margin-top:6px; color:var(--muted); font-size:14px; display:flex; gap:10px; flex-wrap:wrap; }
  .section { margin-top:28px; }
  .section h2 { font-size:16px; letter-spacing:1.5px; color:var(--accent); border-bottom:2px solid var(--accent); padding-bottom:6px; margin:0 0 12px; text-transform:uppercase; }
  .item { margin-bottom:14px; }
  .role { font-weight:600; }
  .meta { color:var(--muted); font-size:14px; }
  .date { color:var(--muted); font-size:12px; margin-top:2px; }
  ul { margin:8px 0 0 18px; }
  li { margin-bottom:6px; }
  .chips { display:flex; flex-wrap:wrap; gap:8px; }
  .chip { background:#f3f4f6; padding:6px 10px; border-radius:999px; font-size:12px; }
</style>
</head>
<body>
  <div class="container">
    <h1>${escape(r.fullName)}</h1>
    ${renderContact(r)}
    ${r.summary ? `<div class="section"><h2>Summary</h2><p>${escape(r.summary)}</p></div>` : ''}
    <div class="section"><h2>Experience</h2>${renderExperience(r)}</div>
    <div class="section"><h2>Education</h2>${renderEducation(r)}</div>
    <div class="section"><h2>Skills</h2>${renderSkills(r)}</div>
  </div>
</body>
</html>`;

// 2) Modern Minimal
const modern = (r: Resume) => `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  :root { --accent:#3b82f6; --bg:#0b1020; --fg:#0b1020; }
  body { font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; background:#ffffff; margin:0; padding:0; }
  .wrap { max-width:900px; margin:40px auto; padding:0; box-shadow:0 10px 30px rgba(0,0,0,0.08); border-radius:16px; overflow:hidden; border:1px solid #e5e7eb; }
  .banner { background:linear-gradient(135deg, var(--accent), #06b6d4); color:white; padding:26px 32px; }
  .name { font-size:28px; font-weight:800; letter-spacing:0.3px; }
  .contact { margin-top:6px; opacity:0.95; font-size:13px; display:flex; gap:12px; flex-wrap:wrap; }
  .content { padding:26px 32px; }
  .section { margin-top:22px; }
  .section h2 { font-size:14px; color:#374151; letter-spacing:1.2px; text-transform:uppercase; margin:0 0 8px; }
  .card { border:1px solid #e5e7eb; border-radius:12px; padding:14px; margin-bottom:12px; }
  .role { font-weight:700; color:#111827; }
  .meta { color:#6b7280; font-size:13px; }
  .date { color:#9ca3af; font-size:12px; }
  ul { margin:8px 0 0 18px; }
  .chips { display:flex; flex-wrap:wrap; gap:8px; }
  .chip { background:#eff6ff; color:#1d4ed8; padding:6px 10px; border-radius:10px; font-size:12px; border:1px solid #bfdbfe; }
</style>
</head>
<body>
  <div class="wrap">
    <div class="banner">
      <div class="name">${escape(r.fullName)}</div>
      ${renderContact(r)}
    </div>
    <div class="content">
      ${r.summary ? `<div class="section"><h2>Summary</h2><p>${escape(r.summary)}</p></div>` : ''}
      <div class="section"><h2>Experience</h2>${r.experience
        .map(
          (e) => `
        <div class="card">
          <div class="role">${escape(e.jobTitle)}</div>
          <div class="meta">${escape(e.company)}${e.location ? ` • ${escape(e.location)}` : ''}</div>
          <div class="date">${escape(e.startDate)} - ${escape(e.endDate || 'Present')}</div>
          ${e.description?.length ? `<ul>${e.description.map((d) => `<li>${escape(d)}</li>`).join('')}</ul>` : ''}
        </div>`
        )
        .join('')}</div>
      <div class="section"><h2>Education</h2>${renderEducation(r)}</div>
      <div class="section"><h2>Skills</h2>${renderSkills(r)}</div>
    </div>
  </div>
</body>
</html>`;

// 3) Elegant Serif
const elegant = (r: Resume) => `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&display=swap');
  :root { --accent:#7c3aed; --muted:#6b7280; }
  body { font-family: 'Merriweather', Georgia, serif; margin:0; padding:48px; color:#1f2937; background:#fafafa; }
  .container { max-width: 820px; margin:0 auto; background:white; border:1px solid #e5e7eb; padding:36px; }
  h1 { margin:0; font-size:30px; }
  .subtitle { color:#6b7280; letter-spacing:1.2px; text-transform:uppercase; font-size:12px; }
  .contact { margin-top:10px; color:#6b7280; font-size:13px; display:flex; gap:12px; flex-wrap:wrap; }
  .rule { height:4px; background:linear-gradient(90deg, var(--accent), #60a5fa); margin:18px 0 8px; border-radius:3px; }
  .section h2 { font-size:16px; margin:18px 0 6px; color:#111827; }
  .item { margin-bottom:12px; }
  .role { font-weight:700; }
  .meta,.date { color:#6b7280; font-size:13px; }
  ul { margin:8px 0 0 18px; }
  .chips { display:flex; flex-wrap:wrap; gap:8px; }
  .chip { background:#ede9fe; color:#5b21b6; border:1px solid #ddd6fe; padding:6px 10px; border-radius:999px; font-size:12px; }
</style>
</head>
<body>
  <div class="container">
    <h1>${escape(r.fullName)}</h1>
    ${r.title ? `<div class="subtitle">${escape(r.title)}</div>` : ''}
    ${renderContact(r)}
    <div class="rule"></div>
    ${r.summary ? `<div class="section"><h2>Profile</h2><p>${escape(r.summary)}</p></div>` : ''}
    <div class="section"><h2>Experience</h2>${renderExperience(r)}</div>
    <div class="section"><h2>Education</h2>${renderEducation(r)}</div>
    <div class="section"><h2>Skills</h2>${renderSkills(r)}</div>
  </div>
</body>
</html>`;

// 4) Bold Sidebar
const sidebar = (r: Resume) => `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  :root { --accent:#0ea5e9; --muted:#475569; }
  body { margin:0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; color:#0f172a; }
  .grid { display:grid; grid-template-columns: 280px 1fr; min-height:100vh; }
  .left { background:#0b1020; color:white; padding:28px; }
  .right { padding:36px; }
  .name { font-size:26px; font-weight:800; }
  .title { color:#a5b4fc; font-size:12px; letter-spacing:1.2px; text-transform:uppercase; }
  .left .section h3 { font-size:13px; text-transform:uppercase; letter-spacing:1px; margin:18px 0 8px; color:#93c5fd; }
  .chip { background:#111827; color:#c7d2fe; border:1px solid #1f2937; padding:6px 10px; border-radius:10px; display:inline-block; margin:0 8px 8px 0; font-size:12px; }
  .contact { margin-top:8px; color:#cbd5e1; font-size:13px; display:flex; gap:8px; flex-wrap:wrap; }
  .right .section h2 { font-size:15px; text-transform:uppercase; letter-spacing:1.2px; margin:0 0 10px; color:#0ea5e9; }
  .item { margin-bottom:14px; }
  .meta { color:#64748b; font-size:13px; }
  .date { color:#94a3b8; font-size:12px; }
  ul { margin:8px 0 0 18px; }
</style>
</head>
<body>
  <div class="grid">
    <aside class="left">
      <div class="name">${escape(r.fullName)}</div>
      ${r.title ? `<div class="title">${escape(r.title)}</div>` : ''}
      <div class="section">
        <h3>Contact</h3>
        <div class="contact">
          <div>${escape(r.email)}</div>
          ${r.phone ? `<div>${escape(r.phone)}</div>` : ''}
          ${r.website ? `<div>${escape(r.website)}</div>` : ''}
        </div>
      </div>
      ${r.skills?.length ? `<div class="section"><h3>Skills</h3>${r.skills
        .map((s) => `<span class="chip">${escape(s.name)}</span>`)
        .join('')}</div>` : ''}
      ${r.education?.length ? `<div class="section"><h3>Education</h3>${r.education
        .map(
          (e) => `<div>
            <div>${escape(e.degree)}</div>
            <div class="meta">${escape(e.institution)}</div>
          </div>`
        )
        .join('')}</div>` : ''}
    </aside>
    <main class="right">
      ${r.summary ? `<div class="section"><h2>Profile</h2><p>${escape(r.summary)}</p></div>` : ''}
      <div class="section"><h2>Experience</h2>${renderExperience(r)}</div>
    </main>
  </div>
</body>
</html>`;

// 5) Timeline Focused
const timeline = (r: Resume) => `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  :root { --accent:#22c55e; --muted:#374151; }
  body { font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; margin:0; padding:40px; color:#0f172a; background:white; }
  .container { max-width:900px; margin:0 auto; }
  h1 { margin:0; font-size:30px; }
  .contact { margin-top:6px; color:#6b7280; font-size:13px; display:flex; gap:10px; flex-wrap:wrap; }
  .section { margin-top:26px; }
  .section h2 { color:#14532d; font-size:14px; letter-spacing:1.2px; text-transform:uppercase; border-left:4px solid var(--accent); padding-left:10px; margin:0 0 10px; }
  .timeline { position:relative; margin-left:14px; }
  .timeline:before { content:''; position:absolute; left:0; top:0; bottom:0; width:2px; background:#d1fae5; }
  .event { position:relative; margin:0 0 18px 18px; }
  .event:before { content:''; position:absolute; left:-19px; top:4px; width:10px; height:10px; background:var(--accent); border-radius:50%; box-shadow:0 0 0 4px #ecfdf5; }
  .role { font-weight:700; }
  .meta { color:#6b7280; font-size:13px; }
  .date { color:#16a34a; font-size:12px; }
  ul { margin:8px 0 0 18px; }
  .chips { display:flex; flex-wrap:wrap; gap:8px; }
  .chip { background:#ecfdf5; color:#166534; border:1px solid #bbf7d0; padding:6px 10px; border-radius:999px; font-size:12px; }
</style>
</head>
<body>
  <div class="container">
    <h1>${escape(r.fullName)}</h1>
    ${renderContact(r)}
    ${r.summary ? `<div class="section"><h2>Overview</h2><p>${escape(r.summary)}</p></div>` : ''}
    <div class="section"><h2>Experience</h2>
      <div class="timeline">
        ${r.experience
          .map(
            (e) => `
          <div class="event">
            <div class="role">${escape(e.jobTitle)}</div>
            <div class="meta">${escape(e.company)}${e.location ? ` • ${escape(e.location)}` : ''}</div>
            <div class="date">${escape(e.startDate)} - ${escape(e.endDate || 'Present')}</div>
            ${e.description?.length ? `<ul>${e.description.map((d) => `<li>${escape(d)}</li>`).join('')}</ul>` : ''}
          </div>`
          )
          .join('')}
      </div>
    </div>
    <div class="section"><h2>Education</h2>${renderEducation(r)}</div>
    <div class="section"><h2>Skills</h2>${renderSkills(r)}</div>
  </div>
</body>
</html>`;
// 6) Compact Grid
const compactGrid = (r: Resume) => `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  :root { --accent:#2563eb; --muted:#6b7280; }
  body { font-family: Inter, sans-serif; margin:0; padding:40px; background:#f9fafb; }
  .container { max-width:900px; margin:auto; display:grid; grid-template-columns: 1fr 1fr; gap:24px; }
  h1 { grid-column:1 / -1; margin:0; font-size:28px; }
  .contact { grid-column:1 / -1; font-size:13px; color:var(--muted); display:flex; gap:10px; flex-wrap:wrap; }
  .section h2 { font-size:14px; color:var(--accent); margin-bottom:8px; text-transform:uppercase; }
  .item { margin-bottom:12px; }
  .role { font-weight:600; }
  .meta { color:var(--muted); font-size:13px; }
  .date { font-size:12px; color:#94a3b8; }
  ul { margin:6px 0 0 18px; }
  .chips { display:flex; flex-wrap:wrap; gap:6px; }
  .chip { background:#eff6ff; color:#1e40af; padding:4px 8px; border-radius:999px; font-size:12px; }
</style>
</head>
<body>
  <div class="container">
    <h1>${escape(r.fullName)}</h1>
    ${renderContact(r)}
    <div>
      ${r.summary ? `<div class="section"><h2>Summary</h2><p>${escape(r.summary)}</p></div>` : ''}
      <div class="section"><h2>Skills</h2>${renderSkills(r)}</div>
    </div>
    <div>
      <div class="section"><h2>Education</h2>${renderEducation(r)}</div>
    </div>
    <div class="section" style="grid-column:1 / -1;">
      <h2>Experience</h2>${renderExperience(r)}
    </div>
  </div>
</body>
</html>`;

// 7) Creative Gradient
const creativeGradient = (r: Resume) => `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  :root { --accent1:#f43f5e; --accent2:#f97316; }
  body { margin:0; font-family: Poppins, sans-serif; }
  .header { background:linear-gradient(135deg,var(--accent1),var(--accent2)); padding:40px; color:white; }
  .name { font-size:32px; font-weight:700; }
  .contact { margin-top:10px; font-size:13px; opacity:0.9; display:flex; gap:12px; flex-wrap:wrap; }
  .content { padding:30px; max-width:900px; margin:auto; }
  .section { margin-top:26px; }
  .section h2 { color:var(--accent1); font-size:15px; text-transform:uppercase; margin:0 0 10px; }
  .role { font-weight:600; }
  .meta { font-size:13px; color:#6b7280; }
  .date { font-size:12px; color:#f97316; }
  ul { margin:6px 0 0 18px; }
  .chip { background:#fff0f3; color:#be123c; padding:5px 10px; border-radius:999px; font-size:12px; display:inline-block; margin:0 6px 6px 0; }
</style>
</head>
<body>
  <div class="header">
    <div class="name">${escape(r.fullName)}</div>
    ${renderContact(r)}
  </div>
  <div class="content">
    ${r.summary ? `<div class="section"><h2>About Me</h2><p>${escape(r.summary)}</p></div>` : ''}
    <div class="section"><h2>Experience</h2>${renderExperience(r)}</div>
    <div class="section"><h2>Education</h2>${renderEducation(r)}</div>
    <div class="section"><h2>Skills</h2>${renderSkills(r)}</div>
  </div>
</body>
</html>`;

//  8) Futuristic Dark Mode
const futuristicDarkMode = (r: Resume) => `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');
  :root { --bg:#0d0f14; --fg:#e0e0e0; --accent:#00e5ff; --muted:#6b7280; }
  body { margin:0; padding:40px; background:var(--bg); color:var(--fg); font-family:'Orbitron', sans-serif; }
  .container { max-width:840px; margin:0 auto; }
  h1 { margin:0; font-size:36px; letter-spacing:2px; color:var(--accent); text-transform:uppercase; }
  .contact { margin-top:8px; font-size:13px; color:var(--muted); display:flex; flex-wrap:wrap; gap:12px; }
  .section { margin-top:32px; }
  .section h2 { font-size:16px; border-left:4px solid var(--accent); padding-left:8px; text-transform:uppercase; color:var(--accent); margin-bottom:12px; }
  .item { margin-bottom:18px; }
  .role { font-size:18px; font-weight:700; color:var(--fg); }
  .meta { font-size:14px; color:var(--muted); margin-top:2px; }
  .date { font-size:13px; color:var(--accent); margin-top:2px; }
  ul { margin:8px 0 0 18px; }
  .chip { display:inline-block; background:var(--accent); color:var(--bg); padding:4px 10px; border-radius:12px; font-size:12px; margin:4px 6px 4px 0; }
</style>
</head>
<body>
  <div class="container">
    <h1>${escape(r.fullName)}</h1>
    ${renderContact(r)}
    ${r.summary ? `<div class="section"><h2>Profile</h2><p>${escape(r.summary)}</p></div>` : ''}
    <div class="section"><h2>Experience</h2>${renderExperience(r)}</div>
    <div class="section"><h2>Education</h2>${renderEducation(r)}</div>
    <div class="section"><h2>Skills</h2>${renderSkills(r)}</div>
  </div>
</body>
</html>`;

// 9) Photo Header
const photoHeader = (r: Resume) => `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  body { font-family: sans-serif; margin:0; background:#f3f4f6; }
  .header { background:white; display:flex; align-items:center; padding:20px; gap:20px; box-shadow:0 2px 4px rgba(0,0,0,0.05); }
  .photo { width:80px; height:80px; border-radius:50%; background:#ddd; flex-shrink:0; }
  .name { font-size:24px; font-weight:700; }
  .contact { font-size:13px; color:#6b7280; display:flex; gap:10px; flex-wrap:wrap; }
  .content { max-width:900px; margin:auto; background:white; padding:30px; margin-top:20px; }
  .section { margin-top:26px; }
  .section h2 { font-size:14px; color:#111827; border-left:4px solid #3b82f6; padding-left:8px; }
  .role { font-weight:600; }
  .meta { font-size:13px; color:#6b7280; }
  .date { font-size:12px; color:#2563eb; }
  .chip { background:#eff6ff; color:#1d4ed8; padding:4px 8px; border-radius:6px; font-size:12px; margin:0 6px 6px 0; display:inline-block; }
</style>
</head>
<body>
  <div class="header">
    <div class="photo"></div>
    <div>
      <div class="name">${escape(r.fullName)}</div>
      ${renderContact(r)}
    </div>
  </div>
  <div class="content">
    ${r.summary ? `<div class="section"><h2>Summary</h2><p>${escape(r.summary)}</p></div>` : ''}
    <div class="section"><h2>Experience</h2>${renderExperience(r)}</div>
    <div class="section"><h2>Education</h2>${renderEducation(r)}</div>
    <div class="section"><h2>Skills</h2>${renderSkills(r)}</div>
  </div>
</body>
</html>`;

// 10) Soft Pastel
const softPastel = (r: Resume) => `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  :root { --bg:#fef6e4; --accent:#f582ae; --muted:#8d99ae; }
  body { font-family: Quicksand, sans-serif; background:var(--bg); margin:0; padding:40px; }
  .container { background:white; padding:30px; max-width:850px; margin:auto; border-radius:20px; box-shadow:0 4px 10px rgba(0,0,0,0.05); }
  h1 { margin:0; font-size:28px; color:#001858; }
  .contact { margin-top:8px; font-size:13px; color:var(--muted); display:flex; gap:10px; flex-wrap:wrap; }
  .section { margin-top:24px; }
  .section h2 { font-size:14px; color:var(--accent); text-transform:uppercase; margin-bottom:8px; }
  .role { font-weight:600; }
  .meta { font-size:13px; color:var(--muted); }
  .date { font-size:12px; color:#f582ae; }
  .chip { background:#fde2e4; color:#9a031e; padding:5px 10px; border-radius:999px; font-size:12px; margin:0 6px 6px 0; display:inline-block; }
</style>
</head>
<body>
  <div class="container">
    <h1>${escape(r.fullName)}</h1>
    ${renderContact(r)}
    ${r.summary ? `<div class="section"><h2>Summary</h2><p>${escape(r.summary)}</p></div>` : ''}
    <div class="section"><h2>Experience</h2>${renderExperience(r)}</div>
    <div class="section"><h2>Education</h2>${renderEducation(r)}</div>
    <div class="section"><h2>Skills</h2>${renderSkills(r)}</div>
  </div>
</body>
</html>`;

// 11) Minimalist Columns
const minimalistColumns = (r: Resume) => `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  :root { --accent:#4b5563; --muted:#6b7280; --bg:#ffffff; }
  body { font-family: Inter, sans-serif; margin:0; padding:40px; background:var(--bg); color:#111827; }
  .container { max-width:950px; margin:auto; display:grid; grid-template-columns: 300px 1fr; gap:32px; }
  h1 { margin:0; font-size:28px; font-weight:700; }
  .sidebar { border-right:1px solid #e5e7eb; padding-right:20px; }
  .main { padding-left:10px; }
  .contact { margin-top:8px; font-size:13px; color:var(--muted); display:flex; flex-wrap:wrap; gap:8px; }
  .section { margin-top:24px; }
  .section h2 { font-size:14px; color:var(--accent); text-transform:uppercase; margin-bottom:8px; }
  .chip { background:#f3f4f6; padding:6px 10px; border-radius:999px; font-size:12px; margin:0 6px 6px 0; display:inline-block; }
  .role { font-weight:600; }
  .meta { color:var(--muted); font-size:13px; }
  .date { font-size:12px; color:#9ca3af; }
  ul { margin:6px 0 0 18px; }
</style>
</head>
<body>
  <div class="container">
    <div class="sidebar">
      <h1>${escape(r.fullName)}</h1>
      ${renderContact(r)}
      ${r.skills?.length ? `<div class="section"><h2>Skills</h2>${renderSkills(r)}</div>` : ''}
      ${r.education?.length ? `<div class="section"><h2>Education</h2>${renderEducation(r)}</div>` : ''}
    </div>
    <div class="main">
      ${r.summary ? `<div class="section"><h2>Summary</h2><p>${escape(r.summary)}</p></div>` : ''}
      <div class="section"><h2>Experience</h2>${renderExperience(r)}</div>
    </div>
  </div>
</body>
</html>`;

// 12) Bold Accent Line
const boldAccentLine = (r: Resume) => `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<style>
  :root { --accent:#ef4444; --muted:#6b7280; }
  body { font-family: 'Segoe UI', sans-serif; margin:0; background:#fafafa; padding:0; }
  .container { max-width:850px; margin:auto; background:white; padding:40px; border-left:10px solid var(--accent); }
  h1 { margin:0; font-size:32px; }
  .contact { margin-top:6px; font-size:13px; color:var(--muted); display:flex; gap:10px; flex-wrap:wrap; }
  .section { margin-top:24px; }
  .section h2 { color:var(--accent); font-size:16px; text-transform:uppercase; margin-bottom:8px; }
  .role { font-weight:600; }
  .meta { font-size:13px; color:var(--muted); }
  .date { font-size:12px; color:var(--accent); }
  .chip { background:#fee2e2; color:#b91c1c; padding:5px 10px; border-radius:999px; font-size:12px; margin:0 6px 6px 0; display:inline-block; }
  ul { margin:6px 0 0 18px; }
</style>
</head>
<body>
  <div class="container">
    <h1>${escape(r.fullName)}</h1>
    ${renderContact(r)}
    ${r.summary ? `<div class="section"><h2>Summary</h2><p>${escape(r.summary)}</p></div>` : ''}
    <div class="section"><h2>Experience</h2>${renderExperience(r)}</div>
    <div class="section"><h2>Education</h2>${renderEducation(r)}</div>
    <div class="section"><h2>Skills</h2>${renderSkills(r)}</div>
  </div>
</body>
</html>`;

// 13) Split Banner
const splitBanner = (r: Resume) => `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<style>
  :root { --accent:#0ea5e9; --muted:#6b7280; }
  body { font-family: Inter, sans-serif; margin:0; padding:0; background:#f9fafb; }
  .banner { display:flex; justify-content:space-between; background:var(--accent); color:white; padding:30px; }
  .name { font-size:28px; font-weight:700; }
  .contact { font-size:13px; display:flex; gap:10px; flex-wrap:wrap; opacity:0.9; }
  .content { max-width:900px; margin:auto; background:white; padding:30px; }
  .section { margin-top:24px; }
  .section h2 { color:var(--accent); font-size:14px; text-transform:uppercase; margin-bottom:8px; }
  .role { font-weight:600; }
  .meta { color:var(--muted); font-size:13px; }
  .date { color:var(--accent); font-size:12px; }
  .chip { background:#e0f2fe; color:#0369a1; padding:4px 8px; border-radius:999px; font-size:12px; margin:0 6px 6px 0; display:inline-block; }
  ul { margin:6px 0 0 18px; }
</style>
</head>
<body>
  <div class="banner">
    <div>
      <div class="name">${escape(r.fullName)}</div>
      ${renderContact(r)}
    </div>
    ${r.title ? `<div class="title" style="align-self:center;font-size:16px;text-transform:uppercase;">${escape(r.title)}</div>` : ''}
  </div>
  <div class="content">
    ${r.summary ? `<div class="section"><h2>About</h2><p>${escape(r.summary)}</p></div>` : ''}
    <div class="section"><h2>Experience</h2>${renderExperience(r)}</div>
    <div class="section"><h2>Education</h2>${renderEducation(r)}</div>
    <div class="section"><h2>Skills</h2>${renderSkills(r)}</div>
  </div>
</body>
</html>`;
// 14) Modern Card Blocks
const modernCardBlocks = (r: Resume) => `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<style>
  :root { --accent:#9333ea; --muted:#6b7280; }
  body { font-family: Inter, sans-serif; margin:0; background:#f3f4f6; padding:40px; }
  .container { max-width:900px; margin:auto; }
  h1 { font-size:28px; margin:0; }
  .contact { margin-top:6px; font-size:13px; color:var(--muted); display:flex; gap:10px; flex-wrap:wrap; }
  .section { margin-top:24px; }
  .section h2 { color:var(--accent); font-size:14px; margin-bottom:12px; text-transform:uppercase; }
  .card { background:white; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,0.05); padding:16px; margin-bottom:12px; }
  .role { font-weight:600; }
  .meta { font-size:13px; color:var(--muted); }
  .date { font-size:12px; color:var(--accent); }
  .chip { background:#f3e8ff; color:#6d28d9; padding:4px 8px; border-radius:999px; font-size:12px; margin:0 6px 6px 0; display:inline-block; }
  ul { margin:6px 0 0 18px; }
</style>
</head>
<body>
  <div class="container">
    <h1>${escape(r.fullName)}</h1>
    ${renderContact(r)}
    ${r.summary ? `<div class="section"><h2>Summary</h2><div class="card"><p>${escape(r.summary)}</p></div></div>` : ''}
    <div class="section"><h2>Experience</h2>${r.experience.map(e => `<div class="card">
      <div class="role">${escape(e.jobTitle)}</div>
      <div class="meta">${escape(e.company)}${e.location ? ` • ${escape(e.location)}` : ''}</div>
      <div class="date">${escape(e.startDate)} - ${escape(e.endDate || 'Present')}</div>
      ${e.description?.length ? `<ul>${e.description.map(d => `<li>${escape(d)}</li>`).join('')}</ul>` : ''}
    </div>`).join('')}</div>
    <div class="section"><h2>Education</h2>${renderEducation(r)}</div>
    <div class="section"><h2>Skills</h2>${renderSkills(r)}</div>
  </div>
</body>
</html>`;

// 15) Elegant Monochrome
const elegantMonochrome = (r: Resume) => `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<style>
  body { font-family: 'Georgia', serif; margin:0; padding:40px; background:#fff; color:#111; }
  .container { max-width:800px; margin:auto; }
  h1 { margin:0; font-size:28px; }
  .contact { margin-top:6px; font-size:13px; color:#555; display:flex; gap:10px; flex-wrap:wrap; }
  .divider { height:1px; background:#ddd; margin:20px 0; }
  .section h2 { font-size:14px; letter-spacing:1.5px; text-transform:uppercase; color:#000; margin-bottom:8px; }
  .role { font-weight:bold; }
  .meta { font-size:13px; color:#555; }
  .date { font-size:12px; color:#000; }
  .chip { background:#eee; color:#000; padding:4px 8px; border-radius:4px; font-size:12px; margin:0 6px 6px 0; display:inline-block; }
  ul { margin:6px 0 0 18px; }
</style>
</head>
<body>
  <div class="container">
    <h1>${escape(r.fullName)}</h1>
    ${renderContact(r)}
    <div class="divider"></div>
    ${r.summary ? `<div class="section"><h2>Summary</h2><p>${escape(r.summary)}</p></div>` : ''}
    <div class="divider"></div>
    <div class="section"><h2>Experience</h2>${renderExperience(r)}</div>
    <div class="divider"></div>
    <div class="section"><h2>Education</h2>${renderEducation(r)}</div>
    <div class="divider"></div>
    <div class="section"><h2>Skills</h2>${renderSkills(r)}</div>
  </div>
</body>
</html>`;

// 16. Magazine Editorial
const magazineEditorial = (r: Resume) => `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Lato:wght@300;400&display=swap" rel="stylesheet">
<style>
  :root {
    --primary: #2c3e50;
    --secondary: #e74c3c;
    --light: #f8f9fa;
    --dark: #212529;
    --accent: #3498db;
  }
  body {
    font-family: 'Lato', sans-serif;
    line-height: 1.6;
    color: var(--dark);
    background: var(--light);
    margin: 0;
    padding: 0;
  }
  .container {
    max-width: 900px;
    margin: 40px auto;
    background: white;
    box-shadow: 0 5px 25px rgba(0,0,0,0.08);
  }
  .header {
    background: var(--primary);
    color: white;
    padding: 40px;
    position: relative;
    overflow: hidden;
  }
  .header::after {
    content: "";
    position: absolute;
    bottom: -20px;
    left: 0;
    right: 0;
    height: 40px;
    background: var(--light);
    transform: skewY(-1.5deg);
    transform-origin: left;
  }
  .name {
    font-family: 'Playfair Display', serif;
    font-size: 3.2rem;
    margin: 0;
    line-height: 1;
  }
  .title {
    font-size: 1.2rem;
    font-weight: 300;
    letter-spacing: 3px;
    text-transform: uppercase;
    opacity: 0.9;
    margin-top: 8px;
  }
  .contact-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 12px;
    margin-top: 20px;
    font-size: 0.9rem;
  }
  .contact-item {
    display: flex;
    align-items: center;
  }
  .contact-item::before {
    content: "•";
    color: var(--secondary);
    margin-right: 8px;
    font-size: 1.4rem;
  }
  .content {
    padding: 40px;
  }
  .section {
    margin-bottom: 40px;
  }
  .section-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.8rem;
    position: relative;
    padding-bottom: 10px;
    margin-bottom: 20px;
  }
  .section-title::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 50px;
    height: 3px;
    background: var(--secondary);
  }
  .summary {
    font-size: 1.1rem;
    line-height: 1.8;
    max-width: 85%;
  }
  .experience-item {
    margin-bottom: 25px;
    position: relative;
    padding-left: 25px;
    border-left: 2px solid var(--accent);
  }
  .experience-item:last-child {
    border-left: 2px solid transparent;
  }
  .role {
    font-weight: bold;
    font-size: 1.1rem;
    color: var(--primary);
  }
  .company {
    display: inline-block;
    background: var(--accent);
    color: white;
    padding: 3px 8px;
    border-radius: 3px;
    margin: 5px 0;
    font-size: 0.9rem;
  }
  .date {
    color: var(--secondary);
    font-size: 0.9rem;
    margin-bottom: 8px;
  }
  .skills-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
  }
  .skill-item {
    background: var(--light);
    padding: 10px 15px;
    border-left: 3px solid var(--secondary);
    font-size: 0.95rem;
  }
  @media (max-width: 768px) {
    .header { padding: 30px; }
    .content { padding: 30px; }
    .name { font-size: 2.5rem; }
    .summary { max-width: 100%; }
  }
</style>
</head>
<body>
  <div class="container">
    <header class="header">
      <h1 class="name">${escape(r.fullName)}</h1>
      ${r.title ? `<div class="title">${escape(r.title)}</div>` : ''}
      <div class="contact-grid">
        <div class="contact-item">${escape(r.email)}</div>
        ${r.phone ? `<div class="contact-item">${escape(r.phone)}</div>` : ''}
        ${r.linkedIn ? `<div class="contact-item">${escape(r.linkedIn)}</div>` : ''}
        ${r.github ? `<div class="contact-item">${escape(r.github)}</div>` : ''}
        ${r.website ? `<div class="contact-item">${escape(r.website)}</div>` : ''}
      </div>
    </header>
    
    <div class="content">
      ${r.summary ? `
      <div class="section">
        <h2 class="section-title">Profile</h2>
        <div class="summary">${escape(r.summary)}</div>
      </div>` : ''}
      
      <div class="section">
        <h2 class="section-title">Experience</h2>
        ${r.experience.map(e => `
          <div class="experience-item">
            <div class="role">${escape(e.jobTitle)}</div>
            <div class="company">${escape(e.company)}</div>
            <div class="date">${escape(e.startDate)} - ${escape(e.endDate || 'Present')}</div>
            ${e.description?.length ? `
              <ul>${e.description.map(d => `<li>${escape(d)}</li>`).join('')}</ul>
            ` : ''}
          </div>
        `).join('')}
      </div>
      
      ${r.education?.length ? `
      <div class="section">
        <h2 class="section-title">Education</h2>
        ${r.education.map(edu => `
          <div class="experience-item">
            <div class="role">${escape(edu.degree)}</div>
            <div class="company">${escape(edu.institution)}</div>
            <div class="date">${escape(edu.startDate)} - ${escape(edu.endDate || 'Present')}</div>
            ${edu.description ? `<p>${escape(edu.description)}</p>` : ''}
          </div>
        `).join('')}
      </div>` : ''}
      
      ${r.skills?.length ? `
      <div class="section">
        <h2 class="section-title">Skills</h2>
        <div class="skills-container">
          ${r.skills.map(s => `
            <div class="skill-item">
              ${escape(s.name)}${s.proficiency ? `<br><small>${escape(s.proficiency)}</small>` : ''}
            </div>
          `).join('')}
        </div>
      </div>` : ''}
    </div>
  </div>
</body>
</html>
`;

// 17. Infographic Minimal
const infographicMinimal = (r: Resume) => `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700&family=Open+Sans:wght@300;400&display=swap" rel="stylesheet">
<style>
  :root {
    --primary: #3498db;
    --secondary: #2ecc71;
    --tertiary: #e74c3c;
    --light: #f9f9f9;
    --dark: #34495e;
  }
  body {
    font-family: 'Open Sans', sans-serif;
    background: linear-gradient(135deg, #f5f7fa 0%, #e4e7f4 100%);
    margin: 0;
    padding: 30px;
    min-height: 100vh;
    color: var(--dark);
  }
  .resume-card {
    max-width: 900px;
    margin: 0 auto;
    background: white;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 15px 50px rgba(0,0,0,0.1);
  }
  .header {
    background: var(--primary);
    color: white;
    padding: 40px;
    text-align: center;
    position: relative;
  }
  .name {
    font-family: 'Montserrat', sans-serif;
    font-size: 2.8rem;
    margin: 0;
    letter-spacing: -0.5px;
  }
  .title {
    font-size: 1.2rem;
    opacity: 0.9;
    margin-top: 8px;
    font-weight: 300;
  }
  .contact-info {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 20px;
    margin-top: 25px;
  }
  .contact-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.95rem;
  }
  .content {
    padding: 40px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
  }
  .section {
    margin-bottom: 30px;
  }
  .section-title {
    font-family: 'Montserrat', sans-serif;
    font-size: 1.4rem;
    color: var(--primary);
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 2px dashed var(--secondary);
    position: relative;
  }
  .section-title::after {
    content: "";
    position: absolute;
    bottom: -6px;
    left: 0;
    width: 20px;
    height: 20px;
    background: var(--tertiary);
    border-radius: 50%;
  }
  .experience-item {
    margin-bottom: 25px;
    position: relative;
    padding-left: 25px;
  }
  .experience-item::before {
    content: "";
    position: absolute;
    left: 0;
    top: 8px;
    width: 12px;
    height: 12px;
    border: 2px solid var(--primary);
    border-radius: 50%;
  }
  .role {
    font-weight: bold;
    margin-bottom: 4px;
    color: var(--dark);
  }
  .company {
    color: var(--primary);
    font-size: 0.95rem;
    margin-bottom: 5px;
  }
  .date {
    background: var(--light);
    display: inline-block;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 0.85rem;
    color: var(--dark);
    margin-bottom: 10px;
  }
  .skill-meter {
    margin-bottom: 15px;
  }
  .skill-name {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
    font-size: 0.95rem;
  }
  .meter-bar {
    height: 8px;
    background: #eee;
    border-radius: 4px;
    overflow: hidden;
  }
  .meter-fill {
    height: 100%;
    background: var(--secondary);
    border-radius: 4px;
  }
  .education-item {
    margin-bottom: 20px;
    padding-left: 20px;
    border-left: 2px solid var(--secondary);
  }
  .degree {
    font-weight: bold;
    margin-bottom: 4px;
  }
  .institution {
    color: var(--primary);
    font-size: 0.95rem;
  }
  @media (max-width: 768px) {
    .content {
      grid-template-columns: 1fr;
      padding: 30px;
      gap: 30px;
    }
    .header {
      padding: 30px 20px;
    }
    .name {
      font-size: 2.3rem;
    }
  }
</style>
</head>
<body>
  <div class="resume-card">
    <header class="header">
      <h1 class="name">${escape(r.fullName)}</h1>
      ${r.title ? `<div class="title">${escape(r.title)}</div>` : ''}
      <div class="contact-info">
        <div class="contact-item">${escape(r.email)}</div>
        ${r.phone ? `<div class="contact-item">${escape(r.phone)}</div>` : ''}
        ${r.linkedIn ? `<div class="contact-item">${escape(r.linkedIn)}</div>` : ''}
        ${r.github ? `<div class="contact-item">${escape(r.github)}</div>` : ''}
        ${r.website ? `<div class="contact-item">${escape(r.website)}</div>` : ''}
      </div>
    </header>
    
    <div class="content">
      <div>
        ${r.summary ? `
        <div class="section">
          <h2 class="section-title">Summary</h2>
          <p>${escape(r.summary)}</p>
        </div>` : ''}
        
        <div class="section">
          <h2 class="section-title">Experience</h2>
          ${r.experience.map(e => `
            <div class="experience-item">
              <div class="role">${escape(e.jobTitle)}</div>
              <div class="company">${escape(e.company)}</div>
              <div class="date">${escape(e.startDate)} - ${escape(e.endDate || 'Present')}</div>
              ${e.description?.length ? `
                <ul>${e.description.map(d => `<li>${escape(d)}</li>`).join('')}</ul>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </div>
      
      <div>
        ${r.education?.length ? `
        <div class="section">
          <h2 class="section-title">Education</h2>
          ${r.education.map(edu => `
            <div class="education-item">
              <div class="degree">${escape(edu.degree)}</div>
              <div class="institution">${escape(edu.institution)}</div>
              <div class="date">${escape(edu.startDate)} - ${escape(edu.endDate || 'Present')}</div>
              ${edu.description ? `<p>${escape(edu.description)}</p>` : ''}
            </div>
          `).join('')}
        </div>` : ''}
        
        ${r.skills?.length ? `
        <div class="section">
          <h2 class="section-title">Skills</h2>
          ${r.skills.map(s => `
            <div class="skill-meter">
              <div class="skill-name">
                <span>${escape(s.name)}</span>
                ${s.proficiency ? `<span>${escape(s.proficiency)}</span>` : ''}
              </div>
              <div class="meter-bar">
                <div class="meter-fill" style="width: ${s.proficiency ? 
                  s.proficiency.includes('Expert') ? '95%' : 
                  s.proficiency.includes('Advanced') ? '85%' : 
                  s.proficiency.includes('Intermediate') ? '70%' : 
                  s.proficiency.includes('Basic') ? '50%' : '60%' 
                  : '60%'}"></div>
              </div>
            </div>
          `).join('')}
        </div>` : ''}
      </div>
    </div>
  </div>
</body>
</html>
`;

// 18. Asymmetric Layout
const asymmetricLayout = (r: Resume) => `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link href="https://fonts.googleapis.com/css2?family=Raleway:wght@800&family=Source+Sans+Pro:wght@300;400;600&display=swap" rel="stylesheet">
<style>
  :root {
    --primary: #e67e22;
    --secondary: #9b59b6;
    --dark: #2c3e50;
    --light: #ecf0f1;
    --accent: #1abc9c;
  }
  body {
    font-family: 'Source Sans Pro', sans-serif;
    background: linear-gradient(45deg, #f5f7fa 0%, #e4e7f4 100%);
    margin: 0;
    padding: 0;
    color: var(--dark);
    min-height: 100vh;
  }
  .resume-container {
    max-width: 1100px;
    margin: 40px auto;
    display: grid;
    grid-template-columns: 40% 60%;
    min-height: 90vh;
    box-shadow: 0 20px 60px rgba(0,0,0,0.15);
  }
  .sidebar {
    background: var(--dark);
    color: white;
    padding: 50px 30px;
    position: relative;
    clip-path: polygon(0 0, 100% 0, 85% 100%, 0% 100%);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .main-content {
    background: white;
    padding: 50px 40px;
  }
  .name {
    font-family: 'Raleway', sans-serif;
    font-size: 2.8rem;
    margin: 0;
    line-height: 1;
    letter-spacing: -1px;
  }
  .title {
    font-size: 1.1rem;
    font-weight: 300;
    margin-top: 10px;
    opacity: 0.9;
  }
  .contact-info {
    margin-top: 40px;
  }
  .contact-item {
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.95rem;
  }
  .divider {
    height: 3px;
    background: var(--primary);
    width: 60px;
    margin: 30px 0;
  }
  .skills-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 15px;
  }
  .skill-tag {
    background: var(--primary);
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.9rem;
  }
  .section {
    margin-bottom: 40px;
  }
  .section-title {
    font-family: 'Raleway', sans-serif;
    font-size: 1.5rem;
    color: var(--secondary);
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 20px;
    position: relative;
    padding-left: 20px;
  }
  .section-title::before {
    content: "";
    position: absolute;
    left: 0;
    top: 10px;
    height: 25px;
    width: 6px;
    background: var(--accent);
  }
  .experience-item {
    margin-bottom: 25px;
    position: relative;
    padding-left: 30px;
  }
  .experience-item::before {
    content: "";
    position: absolute;
    left: 0;
    top: 8px;
    width: 15px;
    height: 15px;
    border: 3px solid var(--primary);
    border-radius: 50%;
  }
  .role {
    font-weight: bold;
    font-size: 1.1rem;
    margin-bottom: 5px;
  }
  .company {
    color: var(--primary);
    font-size: 0.95rem;
    margin-bottom: 5px;
  }
  .date {
    color: var(--dark);
    opacity: 0.7;
    font-size: 0.9rem;
    margin-bottom: 10px;
    display: block;
  }
  .education-item {
    margin-bottom: 20px;
    padding-left: 20px;
    border-left: 2px solid var(--accent);
  }
  .degree {
    font-weight: bold;
    margin-bottom: 4px;
  }
  .institution {
    color: var(--secondary);
    font-size: 0.95rem;
  }
  @media (max-width: 900px) {
    .resume-container {
      grid-template-columns: 1fr;
    }
    .sidebar {
      clip-path: none;
      padding: 40px;
    }
    .contact-info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
  }
  @media (max-width: 600px) {
    .contact-info {
      grid-template-columns: 1fr;
    }
    .sidebar, .main-content {
      padding: 30px;
    }
  }
</style>
</head>
<body>
  <div class="resume-container">
    <aside class="sidebar">
      <div>
        <h1 class="name">${escape(r.fullName)}</h1>
        ${r.title ? `<div class="title">${escape(r.title)}</div>` : ''}
        
        <div class="contact-info">
          <div class="contact-item">${escape(r.email)}</div>
          ${r.phone ? `<div class="contact-item">${escape(r.phone)}</div>` : ''}
          ${r.linkedIn ? `<div class="contact-item">${escape(r.linkedIn)}</div>` : ''}
          ${r.github ? `<div class="contact-item">${escape(r.github)}</div>` : ''}
          ${r.website ? `<div class="contact-item">${escape(r.website)}</div>` : ''}
        </div>
      </div>
      
      ${r.skills?.length ? `
      <div>
        <div class="divider"></div>
        <h3 class="section-title">Skills</h3>
        <div class="skills-container">
          ${r.skills.map(s => `
            <div class="skill-tag">${escape(s.name)}</div>
          `).join('')}
        </div>
      </div>` : ''}
    </aside>
    
    <main class="main-content">
      ${r.summary ? `
      <div class="section">
        <h2 class="section-title">Profile</h2>
        <p>${escape(r.summary)}</p>
      </div>` : ''}
      
      <div class="section">
        <h2 class="section-title">Experience</h2>
        ${r.experience.map(e => `
          <div class="experience-item">
            <div class="role">${escape(e.jobTitle)}</div>
            <div class="company">${escape(e.company)}</div>
            <span class="date">${escape(e.startDate)} - ${escape(e.endDate || 'Present')}</span>
            ${e.description?.length ? `
              <ul>${e.description.map(d => `<li>${escape(d)}</li>`).join('')}</ul>
            ` : ''}
          </div>
        `).join('')}
      </div>
      
      ${r.education?.length ? `
      <div class="section">
        <h2 class="section-title">Education</h2>
        ${r.education.map(edu => `
          <div class="education-item">
            <div class="degree">${escape(edu.degree)}</div>
            <div class="institution">${escape(edu.institution)}</div>
            <span class="date">${escape(edu.startDate)} - ${escape(edu.endDate || 'Present')}</span>
            ${edu.description ? `<p>${escape(edu.description)}</p>` : ''}
          </div>
        `).join('')}
      </div>` : ''}
    </main>
  </div>
</body>
</html>
`;

// 19. Typographic Emphasis
const typographicEmphasis = (r: Resume) => `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Source+Sans+Pro:wght@300;400&display=swap" rel="stylesheet">
<style>
  :root {
    --primary: #2c3e50;
    --secondary: #7f8c8d;
    --accent: #c0392b;
    --light: #f5f5f5;
  }
  body {
    font-family: 'Source Sans Pro', sans-serif;
    background: var(--light);
    color: var(--primary);
    margin: 0;
    padding: 0;
    line-height: 1.7;
  }
  .resume-wrapper {
    max-width: 800px;
    margin: 50px auto;
    padding: 0 20px;
  }
  .header {
    text-align: center;
    margin-bottom: 50px;
    position: relative;
  }
  .name {
    font-family: 'Libre Baskerville', serif;
    font-size: 4rem;
    font-weight: 700;
    margin: 0;
    line-height: 1;
    letter-spacing: -1.5px;
  }
  .title {
    font-size: 1.2rem;
    letter-spacing: 8px;
    text-transform: uppercase;
    margin-top: 15px;
    color: var(--secondary);
  }
  .contact-info {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 25px;
    margin-top: 30px;
    font-size: 0.95rem;
  }
  .section {
    margin-bottom: 45px;
    position: relative;
  }
  .section::before {
    content: attr(data-number);
    position: absolute;
    left: -50px;
    top: -20px;
    font-family: 'Libre Baskerville', serif;
    font-size: 5rem;
    font-weight: 700;
    color: rgba(44, 62, 80, 0.08);
    z-index: -1;
  }
  .section-title {
    font-family: 'Libre Baskerville', serif;
    font-size: 1.8rem;
    font-weight: 700;
    margin-bottom: 25px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--accent);
    display: inline-block;
  }
  .summary {
    font-size: 1.1rem;
    font-style: italic;
  }
  .experience-grid {
    display: grid;
    grid-template-columns: 30% 70%;
    gap: 20px;
    margin-bottom: 30px;
  }
  .date-range {
    color: var(--accent);
    font-size: 0.95rem;
  }
  .experience-details .role {
    font-weight: bold;
    margin-bottom: 5px;
    font-size: 1.1rem;
  }
  .company {
    font-style: italic;
    color: var(--secondary);
    margin-bottom: 10px;
  }
  .education-item {
    margin-bottom: 25px;
  }
  .degree {
    font-weight: bold;
    margin-bottom: 5px;
  }
  .institution {
    color: var(--secondary);
    font-style: italic;
  }
  .skills-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 15px;
  }
  .skill-category {
    margin-bottom: 20px;
  }
  .skill-category h4 {
    margin: 0 0 10px 0;
    color: var(--accent);
    font-weight: normal;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: 0.9rem;
  }
  .skill-items {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .skill-item {
    background: white;
    border: 1px solid #ddd;
    padding: 5px 12px;
    font-size: 0.9rem;
  }
  @media (max-width: 768px) {
    .name {
      font-size: 3rem;
    }
    .experience-grid {
      grid-template-columns: 1fr;
    }
    .section::before {
      left: -30px;
      font-size: 4rem;
    }
  }
</style>
</head>
<body>
  <div class="resume-wrapper">
    <header class="header">
      <h1 class="name">${escape(r.fullName)}</h1>
      ${r.title ? `<div class="title">${escape(r.title)}</div>` : ''}
      <div class="contact-info">
        <div>${escape(r.email)}</div>
        ${r.phone ? `<div>${escape(r.phone)}</div>` : ''}
        ${r.linkedIn ? `<div>${escape(r.linkedIn)}</div>` : ''}
        ${r.github ? `<div>${escape(r.github)}</div>` : ''}
        ${r.website ? `<div>${escape(r.website)}</div>` : ''}
      </div>
    </header>
    
    ${r.summary ? `
    <div class="section" data-number="01">
      <h2 class="section-title">Profile</h2>
      <div class="summary">${escape(r.summary)}</div>
    </div>` : ''}
    
    <div class="section" data-number="02">
      <h2 class="section-title">Experience</h2>
      ${r.experience.map(e => `
        <div class="experience-grid">
          <div class="date-range">${escape(e.startDate)} - ${escape(e.endDate || 'Present')}</div>
          <div class="experience-details">
            <div class="role">${escape(e.jobTitle)}</div>
            <div class="company">${escape(e.company)}</div>
            ${e.description?.length ? `
              <ul>${e.description.map(d => `<li>${escape(d)}</li>`).join('')}</ul>
            ` : ''}
          </div>
        </div>
      `).join('')}
    </div>
    
    ${r.education?.length ? `
    <div class="section" data-number="03">
      <h2 class="section-title">Education</h2>
      ${r.education.map(edu => `
        <div class="education-item">
          <div class="date-range">${escape(edu.startDate)} - ${escape(edu.endDate || 'Present')}</div>
          <div class="degree">${escape(edu.degree)}</div>
          <div class="institution">${escape(edu.institution)}</div>
          ${edu.description ? `<p>${escape(edu.description)}</p>` : ''}
        </div>
      `).join('')}
    </div>` : ''}
    
    ${r.skills?.length ? `
    <div class="section" data-number="04">
      <h2 class="section-title">Skills</h2>
      <div class="skills-container">
        <div class="skill-category">
          <h4>Technical</h4>
          <div class="skill-items">
            ${r.skills.filter(s => !s.category || s.category === 'Technical').map(s => `
              <div class="skill-item">${escape(s.name)}</div>
            `).join('')}
          </div>
        </div>
        <div class="skill-category">
          <h4>Professional</h4>
          <div class="skill-items">
            ${r.skills.filter(s => s.category === 'Professional').map(s => `
              <div class="skill-item">${escape(s.name)}</div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>` : ''}
  </div>
</body>
</html>
`;

// 20. Geometric Minimalism
const geometricMinimalism = (r: Resume) => `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@700&family=Roboto:wght@300;400;500&display=swap" rel="stylesheet">
<style>
  :root {
    --primary: #2980b9;
    --secondary: #e74c3c;
    --light: #ffffff;
    --dark: #2c3e50;
    --gray: #95a5a6;
  }
  body {
    font-family: 'Roboto', sans-serif;
    background: linear-gradient(135deg, #f0f4f8 0%, #dfe7ee 100%);
    margin: 0;
    padding: 40px 20px;
    color: var(--dark);
  }
  .resume-card {
    max-width: 900px;
    margin: 0 auto;
    background: var(--light);
    border-radius: 25px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0,0,0,0.12);
    position: relative;
  }
  .geometric-bg {
    position: absolute;
    top: 0;
    right: 0;
    width: 50%;
    height: 100%;
    background: var(--primary);
    clip-path: polygon(100% 0, 100% 100%, 30% 100%);
    z-index: 0;
    opacity: 0.95;
  }
  .header {
    position: relative;
    padding: 60px 50px 40px;
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: 30px;
    z-index: 1;
  }
  .name-title {
    color: white;
  }
  .name {
    font-family: 'Roboto Condensed', sans-serif;
    font-size: 3.5rem;
    margin: 0;
    line-height: 1;
    letter-spacing: -1px;
  }
  .title {
    font-size: 1.3rem;
    font-weight: 300;
    opacity: 0.9;
    margin-top: 10px;
  }
  .contact-box {
    background: var(--light);
    color: var(--dark);
    padding: 25px;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  }
  .contact-item {
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .contact-item:last-child {
    margin-bottom: 0;
  }
  .content {
    padding: 40px 50px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    position: relative;
    z-index: 1;
  }
  .section {
    margin-bottom: 40px;
  }
  .section-title {
    font-family: 'Roboto Condensed', sans-serif;
    font-size: 1.4rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 3px solid var(--secondary);
    display: inline-block;
  }
  .experience-item {
    margin-bottom: 25px;
    position: relative;
    padding-left: 30px;
  }
  .experience-item::before {
    content: "";
    position: absolute;
    left: 0;
    top: 8px;
    width: 15px;
    height: 15px;
    border: 3px solid var(--primary);
    transform: rotate(45deg);
  }
  .role {
    font-weight: 500;
    font-size: 1.1rem;
    margin-bottom: 5px;
  }
  .company {
    color: var(--primary);
    margin-bottom: 5px;
    font-weight: 500;
  }
  .date {
    color: var(--gray);
    font-size: 0.9rem;
    margin-bottom: 10px;
  }
  .skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 15px;
  }
  .skill-item {
    background: white;
    border: 2px solid var(--primary);
    padding: 10px;
    text-align: center;
    border-radius: 10px;
    font-weight: 500;
    transition: all 0.3s ease;
  }
  .skill-item:hover {
    background: var(--primary);
    color: white;
    transform: translateY(-3px);
  }
  @media (max-width: 900px) {
    .header {
      grid-template-columns: 1fr;
    }
    .content {
      grid-template-columns: 1fr;
    }
    .name {
      font-size: 2.8rem;
    }
    .geometric-bg {
      clip-path: polygon(100% 0, 100% 100%, 70% 100%);
      width: 100%;
      opacity: 0.8;
    }
  }
  @media (max-width: 600px) {
    .header {
      padding: 40px 30px;
    }
    .content {
      padding: 30px;
    }
    .name {
      font-size: 2.2rem;
    }
  }
</style>
</head>
<body>
  <div class="resume-card">
    <div class="geometric-bg"></div>
    
    <header class="header">
      <div class="name-title">
        <h1 class="name">${escape(r.fullName)}</h1>
        ${r.title ? `<div class="title">${escape(r.title)}</div>` : ''}
      </div>
      
      <div class="contact-box">
        <div class="contact-item">${escape(r.email)}</div>
        ${r.phone ? `<div class="contact-item">${escape(r.phone)}</div>` : ''}
        ${r.linkedIn ? `<div class="contact-item">${escape(r.linkedIn)}</div>` : ''}
        ${r.github ? `<div class="contact-item">${escape(r.github)}</div>` : ''}
        ${r.website ? `<div class="contact-item">${escape(r.website)}</div>` : ''}
      </div>
    </header>
    
    <div class="content">
      <div>
        ${r.summary ? `
        <div class="section">
          <h2 class="section-title">Summary</h2>
          <p>${escape(r.summary)}</p>
        </div>` : ''}
        
        <div class="section">
          <h2 class="section-title">Experience</h2>
          ${r.experience.map(e => `
            <div class="experience-item">
              <div class="role">${escape(e.jobTitle)}</div>
              <div class="company">${escape(e.company)}</div>
              <div class="date">${escape(e.startDate)} - ${escape(e.endDate || 'Present')}</div>
              ${e.description?.length ? `
                <ul>${e.description.map(d => `<li>${escape(d)}</li>`).join('')}</ul>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </div>
      
      <div>
        ${r.education?.length ? `
        <div class="section">
          <h2 class="section-title">Education</h2>
          ${r.education.map(edu => `
            <div class="experience-item">
              <div class="role">${escape(edu.degree)}</div>
              <div class="company">${escape(edu.institution)}</div>
              <div class="date">${escape(edu.startDate)} - ${escape(edu.endDate || 'Present')}</div>
              ${edu.description ? `<p>${escape(edu.description)}</p>` : ''}
            </div>
          `).join('')}
        </div>` : ''}
        
        ${r.skills?.length ? `
        <div class="section">
          <h2 class="section-title">Skills</h2>
          <div class="skills-grid">
            ${r.skills.map(s => `
              <div class="skill-item">${escape(s.name)}</div>
            `).join('')}
          </div>
        </div>` : ''}
      </div>
    </div>
  </div>
</body>
</html>
`;

// 21. Hexagonal Grid
const hexagonalGrid = (r: Resume) => `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:wght@300;400;600&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; }
  body {
    font-family: 'Exo 2', sans-serif;
    margin: 0;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
  }
  .container {
    max-width: 900px;
    margin: 0 auto;
    background: white;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  }
  .header {
    background: #2d3748;
    color: white;
    padding: 40px;
    position: relative;
    overflow: hidden;
  }
  .header::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: repeating-conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(255,255,255,0.05) 60deg, transparent 120deg);
  }
  .name {
    font-family: 'Orbitron', monospace;
    font-size: 2.5rem;
    font-weight: 900;
    margin: 0;
    position: relative;
    z-index: 2;
  }
  .title {
    font-size: 1.2rem;
    opacity: 0.9;
    margin-top: 8px;
    position: relative;
    z-index: 2;
  }
  .contact {
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    position: relative;
    z-index: 2;
  }
  .contact-item {
    background: rgba(255,255,255,0.1);
    padding: 8px 15px;
    border-radius: 20px;
    font-size: 0.9rem;
  }
  .content {
    padding: 40px;
  }
  .hex-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
    margin-top: 30px;
  }
  .hex-section {
    position: relative;
    background: #f7fafc;
    padding: 30px;
    clip-path: polygon(20px 0%, 100% 0%, calc(100% - 20px) 100%, 0% 100%);
    border-left: 4px solid #667eea;
  }
  .hex-section:nth-child(even) {
    background: #edf2f7;
    border-left-color: #764ba2;
    clip-path: polygon(0% 0%, calc(100% - 20px) 0%, 100% 100%, 20px 100%);
  }
  .section-title {
    font-family: 'Orbitron', monospace;
    font-size: 1.3rem;
    font-weight: 700;
    color: #2d3748;
    margin: 0 0 20px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  .summary-text {
    line-height: 1.6;
    color: #4a5568;
  }
  .experience-item {
    margin-bottom: 25px;
    padding: 20px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  }
  .job-title {
    font-weight: 600;
    color: #2d3748;
    font-size: 1.1rem;
  }
  .company {
    color: #667eea;
    font-weight: 500;
    margin-top: 4px;
  }
  .date {
    color: #718096;
    font-size: 0.9rem;
    margin-top: 4px;
  }
  .description {
    margin-top: 12px;
    line-height: 1.5;
    color: #4a5568;
  }
  .description ul {
    margin: 8px 0;
    padding-left: 20px;
  }
  .skills-hex {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 15px;
  }
  .skill-hex {
    background: #667eea;
    color: white;
    padding: 8px 16px;
    clip-path: polygon(20% 0%, 80% 0%, 100% 50%, 80% 100%, 20% 100%, 0% 50%);
    font-size: 0.9rem;
    font-weight: 500;
    min-width: 80px;
    text-align: center;
  }
  .skill-hex:nth-child(even) {
    background: #764ba2;
  }
  @media (max-width: 768px) {
    .container {
      margin: 10px;
      border-radius: 15px;
    }
    .header {
      padding: 30px 20px;
    }
    .name {
      font-size: 2rem;
    }
    .content {
      padding: 30px 20px;
    }
    .hex-grid {
      grid-template-columns: 1fr;
      gap: 20px;
    }
    .hex-section {
      clip-path: none;
      border-left: 4px solid #667eea;
    }
    .hex-section:nth-child(even) {
      clip-path: none;
      border-left-color: #764ba2;
    }
    .skill-hex {
      clip-path: none;
      border-radius: 15px;
    }
  }
  @media print {
    body {
      background: white;
      padding: 0;
    }
    .container {
      box-shadow: none;
      border-radius: 0;
    }
    .header::before {
      display: none;
    }
  }
</style>
</head>
<body>
  <div class="container">
    <header class="header">
      <h1 class="name">${escape(r.fullName)}</h1>
      ${r.title ? `<div class="title">${escape(r.title)}</div>` : ''}
      <div class="contact">
        <div class="contact-item">${escape(r.email)}</div>
        ${r.phone ? `<div class="contact-item">${escape(r.phone)}</div>` : ''}
        ${r.linkedIn ? `<div class="contact-item">${escape(r.linkedIn)}</div>` : ''}
        ${r.github ? `<div class="contact-item">${escape(r.github)}</div>` : ''}
        ${r.website ? `<div class="contact-item">${escape(r.website)}</div>` : ''}
      </div>
    </header>
    
    <div class="content">
      <div class="hex-grid">
        ${r.summary ? `
        <div class="hex-section">
          <h2 class="section-title">Summary</h2>
          <div class="summary-text">${escape(r.summary)}</div>
        </div>` : ''}
        
        <div class="hex-section">
          <h2 class="section-title">Experience</h2>
          ${r.experience.map(e => `
            <div class="experience-item">
              <div class="job-title">${escape(e.jobTitle)}</div>
              <div class="company">${escape(e.company)}</div>
              <div class="date">${escape(e.startDate)} - ${escape(e.endDate || 'Present')}</div>
              ${e.description?.length ? `
                <div class="description">
                  <ul>${e.description.map(d => `<li>${escape(d)}</li>`).join('')}</ul>
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
        
        ${r.education?.length ? `
        <div class="hex-section">
          <h2 class="section-title">Education</h2>
          ${r.education.map(edu => `
            <div class="experience-item">
              <div class="job-title">${escape(edu.degree)}</div>
              <div class="company">${escape(edu.institution)}</div>
              <div class="date">${escape(edu.startDate)} - ${escape(edu.endDate || 'Present')}</div>
              ${edu.description ? `<div class="description">${escape(edu.description)}</div>` : ''}
            </div>
          `).join('')}
        </div>` : ''}
        
        ${r.skills?.length ? `
        <div class="hex-section">
          <h2 class="section-title">Skills</h2>
          <div class="skills-hex">
            ${r.skills.map(s => `
              <div class="skill-hex">${escape(s.name)}</div>
            `).join('')}
          </div>
        </div>` : ''}
      </div>
    </div>
  </div>
</body>
</html>
`;

// 22. Diagonal Split
const diagonalSplit = (r: Resume) => `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Source+Sans+Pro:wght@300;400;600&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; }
  body {
    font-family: 'Source Sans Pro', sans-serif;
    margin: 0;
    padding: 0;
    background: #f8f9fa;
    line-height: 1.6;
  }
  .container {
    max-width: 900px;
    margin: 0 auto;
    background: white;
    min-height: 100vh;
    position: relative;
    overflow: hidden;
  }
  .diagonal-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 300px;
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
    clip-path: polygon(0 0, 100% 0, 85% 100%, 0% 80%);
    z-index: 1;
  }
  .header {
    position: relative;
    z-index: 2;
    padding: 60px 40px 40px;
    color: white;
  }
  .name {
    font-family: 'Playfair Display', serif;
    font-size: 3rem;
    font-weight: 900;
    margin: 0;
    text-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  .title {
    font-size: 1.3rem;
    font-weight: 300;
    margin-top: 10px;
    opacity: 0.95;
  }
  .contact-diagonal {
    margin-top: 25px;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }
  .contact-item {
    background: rgba(255,255,255,0.2);
    padding: 10px 20px;
    border-radius: 25px;
    font-size: 0.95rem;
    backdrop-filter: blur(10px);
  }
  .content {
    position: relative;
    z-index: 2;
    padding: 40px;
    margin-top: -50px;
  }
  .section {
    margin-bottom: 40px;
    position: relative;
  }
  .section::before {
    content: '';
    position: absolute;
    top: 0;
    left: -20px;
    width: 4px;
    height: 100%;
    background: linear-gradient(45deg, #ff6b6b, #ee5a24);
    clip-path: polygon(0 0, 100% 0, 50% 100%, 0% 100%);
  }
  .section-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.8rem;
    font-weight: 700;
    color: #2c3e50;
    margin: 0 0 25px;
    position: relative;
  }
  .section-title::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 60px;
    height: 3px;
    background: linear-gradient(45deg, #ff6b6b, #ee5a24);
    clip-path: polygon(0 0, 90% 0, 100% 100%, 10% 100%);
  }
  .summary-box {
    background: #f8f9fa;
    padding: 25px;
    border-radius: 15px;
    position: relative;
    overflow: hidden;
  }
  .summary-box::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 100px;
    height: 100px;
    background: linear-gradient(135deg, #ff6b6b, #ee5a24);
    opacity: 0.1;
    clip-path: polygon(50% 0%, 100% 0, 100% 50%);
  }
  .experience-item {
    margin-bottom: 30px;
    padding: 25px;
    background: white;
    border-radius: 15px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.08);
    position: relative;
    overflow: hidden;
  }
  .experience-item::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 5px;
    height: 100%;
    background: linear-gradient(45deg, #ff6b6b, #ee5a24);
  }
  .job-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.3rem;
    font-weight: 700;
    color: #2c3e50;
    margin: 0;
  }
  .company {
    color: #ff6b6b;
    font-weight: 600;
    font-size: 1.1rem;
    margin-top: 5px;
  }
  .date {
    color: #7f8c8d;
    font-size: 0.95rem;
    margin-top: 5px;
    font-style: italic;
  }
  .description {
    margin-top: 15px;
    color: #34495e;
  }
  .description ul {
    margin: 10px 0;
    padding-left: 20px;
  }
  .skills-diagonal {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 20px;
  }
  .skill-tag {
    background: linear-gradient(135deg, #ff6b6b, #ee5a24);
    color: white;
    padding: 10px 18px;
    border-radius: 25px;
    font-size: 0.9rem;
    font-weight: 500;
    position: relative;
    overflow: hidden;
  }
  .skill-tag::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s;
  }
  .skill-tag:hover::before {
    left: 100%;
  }
  @media (max-width: 768px) {
    .container {
      margin: 0;
    }
    .header {
      padding: 40px 20px 30px;
    }
    .name {
      font-size: 2.2rem;
    }
    .content {
      padding: 30px 20px;
      margin-top: -30px;
    }
    .section::before {
      left: -10px;
    }
    .diagonal-bg {
      height: 250px;
    }
  }
  @media print {
    body {
      background: white;
    }
    .container {
      box-shadow: none;
    }
    .diagonal-bg {
      background: #ddd !important;
    }
    .skill-tag {
      background: #666 !important;
    }
  }
</style>
</head>
<body>
  <div class="container">
    <div class="diagonal-bg"></div>
    
    <header class="header">
      <h1 class="name">${escape(r.fullName)}</h1>
      ${r.title ? `<div class="title">${escape(r.title)}</div>` : ''}
      <div class="contact-diagonal">
        <div class="contact-item">${escape(r.email)}</div>
        ${r.phone ? `<div class="contact-item">${escape(r.phone)}</div>` : ''}
        ${r.linkedIn ? `<div class="contact-item">${escape(r.linkedIn)}</div>` : ''}
        ${r.github ? `<div class="contact-item">${escape(r.github)}</div>` : ''}
        ${r.website ? `<div class="contact-item">${escape(r.website)}</div>` : ''}
      </div>
    </header>
    
    <div class="content">
      ${r.summary ? `
      <div class="section">
        <h2 class="section-title">Summary</h2>
        <div class="summary-box">
          ${escape(r.summary)}
        </div>
      </div>` : ''}
      
      <div class="section">
        <h2 class="section-title">Experience</h2>
        ${r.experience.map(e => `
          <div class="experience-item">
            <div class="job-title">${escape(e.jobTitle)}</div>
            <div class="company">${escape(e.company)}</div>
            <div class="date">${escape(e.startDate)} - ${escape(e.endDate || 'Present')}</div>
            ${e.description?.length ? `
              <div class="description">
                <ul>${e.description.map(d => `<li>${escape(d)}</li>`).join('')}</ul>
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
      
      ${r.education?.length ? `
      <div class="section">
        <h2 class="section-title">Education</h2>
        ${r.education.map(edu => `
          <div class="experience-item">
            <div class="job-title">${escape(edu.degree)}</div>
            <div class="company">${escape(edu.institution)}</div>
            <div class="date">${escape(edu.startDate)} - ${escape(edu.endDate || 'Present')}</div>
            ${edu.description ? `<div class="description">${escape(edu.description)}</div>` : ''}
          </div>
        `).join('')}
      </div>` : ''}
      
      ${r.skills?.length ? `
      <div class="section">
        <h2 class="section-title">Skills</h2>
        <div class="skills-diagonal">
          ${r.skills.map(s => `
            <div class="skill-tag">${escape(s.name)}</div>
          `).join('')}
        </div>
      </div>` : ''}
    </div>
  </div>
</body>
</html>
`;

export const renderHTMLTemplate = (resume: Resume, template: TemplateId): string => {
    switch (template) {
      case 'classic': return classic(resume);
      case 'modern': return modern(resume);
      case 'elegant': return elegant(resume);
      case 'sidebar': return sidebar(resume);
      case 'timeline': return timeline(resume);
      case 'compactGrid': return compactGrid(resume);
      case 'creativeGradient': return creativeGradient(resume);
      case 'futuristicDarkMode': return futuristicDarkMode(resume);
      case 'photoHeader': return photoHeader(resume);
      case 'softPastel': return softPastel(resume);
      case 'minimalistColumns': return minimalistColumns(resume);
      case 'boldAccentLine': return boldAccentLine(resume);
      case 'splitBanner': return splitBanner(resume);
      case 'modernCardBlocks': return modernCardBlocks(resume);
      case 'elegantMonochrome': return elegantMonochrome(resume);
      case 'geometricMinimalism': return geometricMinimalism(resume);
      case 'magazineEditorial': return magazineEditorial(resume);
      case 'infographicMinimal': return infographicMinimal(resume);
      case 'asymmetricLayout': return asymmetricLayout(resume);
      case 'typographicEmphasis': return typographicEmphasis(resume);
      case 'layeredPaper': return layeredPaper(resume);
      case 'artDecoRevival': return artDecoRevival(resume);
      case 'circularOrbit': return circularOrbit(resume);
      case 'verticalRibbon': return verticalRibbon(resume);
      case 'diagonalSplit': return diagonalSplit(resume);
      default: return classic(resume);
    }
  };
export const listHTMLTemplates = () =>
  (Object.keys(TEMPLATE_NAMES) as TemplateId[]).map((id) => ({ id, name: TEMPLATE_NAMES[id] }));
