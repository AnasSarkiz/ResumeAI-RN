import { ManualResumeInput } from '../types/resume';
import {
  escape,
  renderContact,
  renderEducation,
  renderExperience,
  renderSkills,
  A4_STYLES,
} from './templates-helpers';

// 1) Classic Professional
const classic = (r: ManualResumeInput) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  ${A4_STYLES}
  :root { --accent:#1f2937; --muted:#6b7280; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; color:#111827; }
  .container { width: 100%; }
  h1 { margin:0; font-size:24px; }
  .contact { margin-top:6px; color:var(--muted); font-size:12px; display:flex; gap:8px; }
  .section { margin-top:20px; }
  .section h2 { font-size:14px; letter-spacing:1px; color:var(--accent); border-bottom:2px solid var(--accent); padding-bottom:4px; margin:0 0 10px; text-transform:uppercase; }
  .item { margin-bottom:12px; }
  .role { font-weight:600; }
  .meta { color:var(--muted); font-size:12px; }
  .date { color:var(--muted); font-size:11px; margin-top:2px; }
  ul { margin:6px 0 0 16px; padding:0; }
  li { margin-bottom:4px; font-size:12px; }
  .chips { display:flex; flex-wrap:wrap; gap:6px; }
  .chip { background:#f3f4f6; padding:4px 8px; border-radius:999px; font-size:11px; }
</style>
</head>
<body>
  <div class="page">
  <div class="container">
    <h1>${escape(r.fullName)}</h1>
    ${renderContact(r)}
    ${r.summary ? `<div class="section"><h2>Summary</h2><p style="font-size:12px;">${escape(r.summary)}</p></div>` : ''}
    <div class="section"><h2>Experience</h2>${renderExperience(r)}</div>
    <div class="section"><h2>Education</h2>${renderEducation(r)}</div>
    <div class="section"><h2>Skills</h2>${renderSkills(r)}</div>
  </div>
  </div>
</body>
</html>`;

// 2) Modern Minimal
const modern = (r: ManualResumeInput) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  ${A4_STYLES}
  :root { --accent:#3b82f6; --bg:#0b1020; --fg:#0b1020; }
  body { font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; }
  .wrap { width: 100%; height: 100%; border:1px solid #e5e7eb; }
  .banner { background:linear-gradient(135deg, var(--accent), #06b6d4); color:white; padding:20px; }
  .name { font-size:24px; font-weight:800; }
  .contact { margin-top:6px; opacity:0.95; font-size:12px; display:flex; gap:8px; }
  .content { padding:20px; }
  .section { margin-top:18px; }
  .section h2 { font-size:13px; color:#374151; letter-spacing:1px; text-transform:uppercase; margin:0 0 8px; }
  .card { border:1px solid #e5e7eb; border-radius:8px; padding:12px; margin-bottom:10px; }
  .role { font-weight:700; color:#111827; font-size:14px; }
  .meta { color:#6b7280; font-size:12px; }
  .date { color:#9ca3af; font-size:11px; }
  ul { margin:6px 0 0 16px; padding:0; }
  li { font-size:12px; margin-bottom:4px; }
  .chips { display:flex; flex-wrap:wrap; gap:6px; }
  .chip { background:#eff6ff; color:#1d4ed8; padding:4px 8px; border-radius:8px; font-size:11px; border:1px solid #bfdbfe; }
</style>
</head>
<body>
  <div class="page">
  <div class="wrap">
    <div class="banner">
      <div class="name">${escape(r.fullName)}</div>
      ${renderContact(r)}
    </div>
    <div class="content">
      ${r.summary ? `<div class="section"><h2>Summary</h2><p style="font-size:12px;">${escape(r.summary)}</p></div>` : ''}
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
  </div>
</body>
</html>`;

// 3) Elegant Serif
const elegant = (r: ManualResumeInput) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  ${A4_STYLES}
  :root { --accent:#7c3aed; --muted:#6b7280; }
  body { font-family: 'Merriweather', Georgia, serif; }
  .container { width: 100%; height: 100%; border:1px solid #e5e7eb; padding:20px; }
  h1 { margin:0; font-size:24px; }
  .subtitle { color:#6b7280; letter-spacing:1px; text-transform:uppercase; font-size:11px; }
  .contact { margin-top:8px; color:#6b7280; font-size:12px; display:flex; gap:8px; }
  .rule { height:3px; background:linear-gradient(90deg, var(--accent), #60a5fa); margin:12px 0 6px; }
  .section h2 { font-size:14px; margin:16px 0 6px; color:#111827; }
  .item { margin-bottom:10px; }
  .role { font-weight:700; font-size:14px; }
  .meta,.date { color:#6b7280; font-size:12px; }
  ul { margin:6px 0 0 16px; padding:0; }
  li { font-size:12px; margin-bottom:4px; }
  .chips { display:flex; flex-wrap:wrap; gap:6px; }
  .chip { background:#ede9fe; color:#5b21b6; border:1px solid #ddd6fe; padding:4px 8px; border-radius:999px; font-size:11px; }
</style>
</head>
<body>
  <div class="page">
  <div class="container">
    <h1>${escape(r.fullName)}</h1>
    ${r.title ? `<div class="subtitle">${escape(r.title)}</div>` : ''}
    ${renderContact(r)}
    <div class="rule"></div>
    ${r.summary ? `<div class="section"><h2>Profile</h2><p style="font-size:12px;">${escape(r.summary)}</p></div>` : ''}
    <div class="section"><h2>Experience</h2>${renderExperience(r)}</div>
    <div class="section"><h2>Education</h2>${renderEducation(r)}</div>
    <div class="section"><h2>Skills</h2>${renderSkills(r)}</div>
  </div>
  </div>
</body>
</html>`;

// 4) Bold Sidebar
const sidebar = (r: ManualResumeInput) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  ${A4_STYLES}
  :root { --accent:#0ea5e9; --muted:#475569; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; }
  .grid { display:grid; grid-template-columns: 70mm 1fr; width: 100%; }
  .left { background:#0b1020; color:white; padding:0; }
  .left .inner { padding: 15mm; }
  .right { padding:15mm; }
  .name { font-size:22px; font-weight:800; }
  .title { color:#a5b4fc; font-size:11px; letter-spacing:1px; text-transform:uppercase; }
  .left .section h3 { font-size:12px; text-transform:uppercase; letter-spacing:1px; margin:16px 0 8px; color:#93c5fd; }
  .chip { background:#111827; color:#c7d2fe; border:1px solid #1f2937; padding:4px 8px; border-radius:8px; display:inline-block; margin:0 6px 6px 0; font-size:11px; }
  .contact { margin-top:8px; color:#cbd5e1; font-size:12px; }
  .right .section h2 { font-size:13px; text-transform:uppercase; letter-spacing:1px; margin:0 0 8px; color:#0ea5e9; }
  .item { margin-bottom:12px; }
  .meta { color:#64748b; font-size:12px; }
  .date { color:#94a3b8; font-size:11px; }
  ul { margin:6px 0 0 16px; padding:0; }
  li { font-size:12px; margin-bottom:4px; }
</style>
</head>
<body>
  <div class="page">
  <div class="grid">
    <aside class="left"><div class="inner">
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
      ${
        r.skills?.length
          ? `<div class="section"><h3>Skills</h3>${r.skills
              .map((s) => `<span class="chip">${escape(s.name)}</span>`)
              .join('')}</div>`
          : ''
      }
      ${
        r.education?.length
          ? `<div class="section"><h3>Education</h3>${r.education
              .map(
                (e) => `<div>
            <div>${escape(e.degree)}</div>
            <div class="meta">${escape(e.institution)}</div>
          </div>`
              )
              .join('')}</div>`
          : ''
      }
    </div></aside>
    <main class="right">
      ${r.summary ? `<div class="section"><h2>Profile</h2><p style="font-size:12px;">${escape(r.summary)}</p></div>` : ''}
      <div class="section"><h2>Experience</h2>${renderExperience(r)}</div>
    </main>
  </div>
  </div>
</body>
</html>`;

// 5) Timeline Focused
const timeline = (r: ManualResumeInput) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  ${A4_STYLES}
  :root { --accent:#22c55e; --muted:#374151; }
  body { font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; }
  .container { width: 100%; }
  h1 { margin:0; font-size:24px; }
  .contact { margin-top:6px; color:#6b7280; font-size:12px; display:flex; gap:8px; }
  .section { margin-top:20px; }
  .section h2 { color:#14532d; font-size:13px; letter-spacing:1px; text-transform:uppercase; border-left:3px solid var(--accent); padding-left:8px; margin:0 0 8px; }
  .timeline { position:relative; margin-left:12px; }
  .timeline:before { content:''; position:absolute; left:0; top:0; bottom:0; width:2px; background:#d1fae5; }
  .event { position:relative; margin:0 0 14px 16px; }
  .event:before { content:''; position:absolute; left:-17px; top:4px; width:8px; height:8px; background:var(--accent); border-radius:50%; box-shadow:0 0 0 3px #ecfdf5; }
  .role { font-weight:700; font-size:14px; }
  .meta { color:#6b7280; font-size:12px; }
  .date { color:#16a34a; font-size:11px; }
  ul { margin:6px 0 0 16px; padding:0; }
  li { font-size:12px; margin-bottom:4px; }
  .chips { display:flex; flex-wrap:wrap; gap:6px; }
  .chip { background:#ecfdf5; color:#166534; border:1px solid #bbf7d0; padding:4px 8px; border-radius:999px; font-size:11px; }
</style>
</head>
<body>
  <div class="page">
  <div class="container">
    <h1>${escape(r.fullName)}</h1>
    ${renderContact(r)}
    ${r.summary ? `<div class="section"><h2>Overview</h2><p style="font-size:12px;">${escape(r.summary)}</p></div>` : ''}
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
  </div>
</body>
</html>`;

// 6) Compact Grid
const compactGrid = (r: ManualResumeInput) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  ${A4_STYLES}
  :root { --accent:#2563eb; --muted:#6b7280; }
  body { font-family: Inter, sans-serif; }
  .container { width: 100%; display:grid; grid-template-columns: 1fr 1fr; gap:16px; }
  h1 { grid-column:1 / -1; margin:0; font-size:24px; }
  .contact { grid-column:1 / -1; font-size:12px; color:var(--muted); display:flex; gap:8px; }
  .section h2 { font-size:13px; color:var(--accent); margin-bottom:8px; text-transform:uppercase; }
  .item { margin-bottom:10px; }
  .role { font-weight:600; font-size:14px; }
  .meta { color:var(--muted); font-size:12px; }
  .date { font-size:11px; color:#94a3b8; }
  ul { margin:6px 0 0 16px; padding:0; }
  li { font-size:12px; margin-bottom:4px; }
  .chips { display:flex; flex-wrap:wrap; gap:6px; }
  .chip { background:#eff6ff; color:#1e40af; padding:4px 8px; border-radius:999px; font-size:11px; }
</style>
</head>
<body>
  <div class="page">
  <div class="container">
    <h1>${escape(r.fullName)}</h1>
    ${renderContact(r)}
    <div>
      ${r.summary ? `<div class="section"><h2>Summary</h2><p style="font-size:12px;">${escape(r.summary)}</p></div>` : ''}
      <div class="section"><h2>Skills</h2>${renderSkills(r)}</div>
    </div>
    <div>
      <div class="section"><h2>Education</h2>${renderEducation(r)}</div>
    </div>
    <div class="section" style="grid-column:1 / -1;">
      <h2>Experience</h2>${renderExperience(r)}
    </div>
  </div>
  </div>
</body>
</html>`;

// 7) Creative Gradient
const creativeGradient = (r: ManualResumeInput) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  ${A4_STYLES}
  :root { --accent1:#f43f5e; --accent2:#f97316; }
  body { font-family: Poppins, sans-serif; }
  .header { background:linear-gradient(135deg,var(--accent1),var(--accent2)); color:white; padding:20px; }
  .name { font-size:24px; font-weight:700; }
  .contact { margin-top:8px; font-size:12px; opacity:0.9; display:flex; gap:8px; }
  .content { padding:20px; width: 100%; }
  .section { margin-top:20px; }
  .section h2 { color:var(--accent1); font-size:13px; text-transform:uppercase; margin:0 0 8px; }
  .role { font-weight:600; font-size:14px; }
  .meta { font-size:12px; color:#6b7280; }
  .date { font-size:11px; color:#f97316; }
  ul { margin:6px 0 0 16px; padding:0; }
  li { font-size:12px; margin-bottom:4px; }
  .chip { display:inline-block; background:var(--accent); color:var(--bg); padding:4px 8px; border-radius:8px; font-size:11px; margin:4px 6px 4px 0; }
</style>
</head>
<body>
  <div class="page">
  <div class="header">
    <div class="name">${escape(r.fullName)}</div>
    ${renderContact(r)}
  </div>
  <div class="content">
    ${r.summary ? `<div class="section"><h2>About Me</h2><p style="font-size:12px;">${escape(r.summary)}</p></div>` : ''}
    <div class="section"><h2>Experience</h2>${renderExperience(r)}</div>
    <div class="section"><h2>Education</h2>${renderEducation(r)}</div>
    <div class="section"><h2>Skills</h2>${renderSkills(r)}</div>
  </div>
  </div>
</body>
</html>`;

// 8) Futuristic Dark Mode
const futuristicDarkMode = (r: ManualResumeInput) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  ${A4_STYLES}
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');
  :root { --bg:#0d0f14; --fg:#e0e0e0; --accent:#00e5ff; --muted:#6b7280; }
  body { background:var(--bg); color:var(--fg); font-family:'Orbitron', sans-serif; }
  .container { width: 100%; }
  h1 { margin:0; font-size:24px; letter-spacing:1px; color:var(--accent); text-transform:uppercase; }
  .contact { margin-top:6px; font-size:12px; color:var(--muted); display:flex; gap:8px; }
  .section { margin-top:20px; }
  .section h2 { font-size:14px; border-left:3px solid var(--accent); padding-left:8px; text-transform:uppercase; color:var(--accent); margin-bottom:10px; }
  .item { margin-bottom:14px; }
  .role { font-size:14px; font-weight:700; color:var(--fg); }
  .meta { font-size:12px; color:var(--muted); margin-top:2px; }
  .date { font-size:11px; color:var(--accent); margin-top:2px; }
  ul { margin:6px 0 0 16px; padding:0; }
  li { font-size:12px; margin-bottom:4px; }
  .chip { display:inline-block; background:var(--accent); color:var(--bg); padding:4px 8px; border-radius:8px; font-size:11px; margin:4px 6px 4px 0; }
</style>
</head>
<body>
  <div class="page">
  <div class="container">
    <h1>${escape(r.fullName)}</h1>
    ${renderContact(r)}
    ${r.summary ? `<div class="section"><h2>Profile</h2><p style="font-size:12px;">${escape(r.summary)}</p></div>` : ''}
    <div class="section"><h2>Experience</h2>${renderExperience(r)}</div>
    <div class="section"><h2>Education</h2>${renderEducation(r)}</div>
    <div class="section"><h2>Skills</h2>${renderSkills(r)}</div>
  </div>
  </div>
</body>
</html>`;

// 9) Photo Header
const photoHeader = (r: ManualResumeInput) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  ${A4_STYLES}
  body { font-family: sans-serif; }
  .header { background:white; display:flex; align-items:center; padding:20px; gap:16px; }
  .photo { width:60px; height:60px; border-radius:50%; background:#ddd; flex-shrink:0; }
  .name { font-size:22px; font-weight:700; }
  .contact { font-size:12px; color:#6b7280; display:flex; gap:8px; }
  .content { width: 100%; padding:20px; }
  .section { margin-top:20px; }
  .section h2 { font-size:13px; color:#111827; border-left:3px solid #3b82f6; padding-left:8px; }
  .role { font-weight:600; font-size:14px; }
  .meta { font-size:12px; color:#6b7280; }
  .date { font-size:11px; color:#2563eb; }
  .chip { background:#eff6ff; color:#1d4ed8; padding:4px 8px; border-radius:6px; font-size:11px; margin:0 6px 6px 0; display:inline-block; }
  ul { margin:6px 0 0 16px; padding:0; }
  li { font-size:12px; margin-bottom:4px; }
</style>
</head>
<body>
  <div class="page">
  <div class="header">
    <div class="photo"></div>
    <div>
      <div class="name">${escape(r.fullName)}</div>
      ${renderContact(r)}
    </div>
  </div>
  <div class="content">
    ${r.summary ? `<div class="section"><h2>Summary</h2><p style="font-size:12px;">${escape(r.summary)}</p></div>` : ''}
    <div class="section"><h2>Experience</h2>${renderExperience(r)}</div>
    <div class="section"><h2>Education</h2>${renderEducation(r)}</div>
    <div class="section"><h2>Skills</h2>${renderSkills(r)}</div>
  </div>
  </div>
</body>
</html>`;

// 10) Soft Pastel
const softPastel = (r: ManualResumeInput) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  ${A4_STYLES}
  :root { --bg:#fef6e4; --accent:#f582ae; --muted:#8d99ae; }
  body { font-family: Quicksand, sans-serif; background:var(--bg); }
  .container { background:white; padding:20px; width: 100%; border-radius:12px; }
  h1 { margin:0; font-size:24px; color:#001858; }
  .contact { margin-top:6px; font-size:12px; color:var(--muted); display:flex; gap:8px; }
  .section { margin-top:20px; }
  .section h2 { font-size:13px; color:var(--accent); text-transform:uppercase; margin-bottom:8px; }
  .role { font-weight:600; font-size:14px; }
  .meta { font-size:12px; color:var(--muted); }
  .date { font-size:11px; color:#f582ae; }
  .chip { background:#fde2e4; color:#9a031e; padding:4px 8px; border-radius:999px; font-size:11px; margin:0 6px 6px 0; display:inline-block; }
  ul { margin:6px 0 0 16px; padding:0; }
  li { font-size:12px; margin-bottom:4px; }
</style>
</head>
<body>
  <div class="container">
    <h1>${escape(r.fullName)}</h1>
    ${renderContact(r)}
    ${r.summary ? `<div class="section"><h2>Summary</h2><p style="font-size:12px;">${escape(r.summary)}</p></div>` : ''}
    <div class="section"><h2>Experience</h2>${renderExperience(r)}</div>
    <div class="section"><h2>Education</h2>${renderEducation(r)}</div>
    <div class="section"><h2>Skills</h2>${renderSkills(r)}</div>
  </div>
</body>
</html>`;

export {
  classic,
  modern,
  elegant,
  sidebar,
  timeline,
  compactGrid,
  creativeGradient,
  futuristicDarkMode,
  photoHeader,
  softPastel,
};
