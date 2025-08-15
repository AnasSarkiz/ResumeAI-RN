import { ManualResumeInput } from '../types/resume';
import {
  escape,
  renderContact,
  renderEducation,
  renderExperience,
  renderSkills,
} from './templates-helpers';
// 1) Classic Professional
const classic = (r: ManualResumeInput) => `
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
  @page { size: A4; margin: 15mm; }
  @media print {
    html, body { width: 210mm; height: 297mm; margin: 0; padding: 0; background: white; }
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .container { max-width: initial; width: auto; box-shadow: none; margin: 0; }
    .section, .item { break-inside: avoid; page-break-inside: avoid; }
  }
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
const modern = (r: ManualResumeInput) => `
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
  @page { size: A4; margin: 15mm; }
  @media print {
    html, body { width: 210mm; height: 297mm; margin: 0; padding: 0; background: white; }
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .wrap { max-width: initial; width: auto; box-shadow: none; margin: 0; }
    .section, .card { break-inside: avoid; page-break-inside: avoid; }
  }
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
const elegant = (r: ManualResumeInput) => `
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
  @page { size: A4; margin: 15mm; }
  @media print {
    html, body { width: 210mm; height: 297mm; margin: 0; padding: 0; background: white; }
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .container { max-width: initial; width: auto; box-shadow: none; margin: 0; border: none; }
    .section, .item { break-inside: avoid; page-break-inside: avoid; }
  }
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
const sidebar = (r: ManualResumeInput) => `
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
  @page { size: A4; margin: 15mm; }
  @media print {
    html, body { width: 210mm; height: 297mm; margin: 0; padding: 0; background: white; }
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .grid { min-height: auto; }
    .left, .right { box-shadow: none; }
    .section { break-inside: avoid; page-break-inside: avoid; }
  }
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
    </aside>
    <main class="right">
      ${r.summary ? `<div class="section"><h2>Profile</h2><p>${escape(r.summary)}</p></div>` : ''}
      <div class="section"><h2>Experience</h2>${renderExperience(r)}</div>
    </main>
  </div>
</body>
</html>`;

// 5) Timeline Focused
const timeline = (r: ManualResumeInput) => `
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
  @page { size: A4; margin: 15mm; }
  @media print {
    html, body { width: 210mm; height: 297mm; margin: 0; padding: 0; background: white; }
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .container { max-width: initial; width: auto; margin: 0; }
    .timeline:before { background: #ccc; }
    .event { break-inside: avoid; page-break-inside: avoid; }
  }
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
const compactGrid = (r: ManualResumeInput) => `
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
  @page { size: A4; margin: 15mm; }
  @media print {
    html, body { width: 210mm; height: 297mm; margin: 0; padding: 0; background: white; }
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .container { max-width: initial; width: auto; margin: 0; }
    .section, .item { break-inside: avoid; page-break-inside: avoid; }
  }
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
const creativeGradient = (r: ManualResumeInput) => `
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
  @page { size: A4; margin: 15mm; }
  @media print {
    html, body { width: 210mm; height: 297mm; margin: 0; padding: 0; background: white; }
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .content { max-width: initial; width: auto; margin: 0; }
    .section { break-inside: avoid; page-break-inside: avoid; }
  }
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
const futuristicDarkMode = (r: ManualResumeInput) => `
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
  @page { size: A4; margin: 15mm; }
  @media print {
    html, body { width: 210mm; height: 297mm; margin: 0; padding: 0; background: white; }
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .container { max-width: initial; width: auto; margin: 0; }
    .section, .item { break-inside: avoid; page-break-inside: avoid; }
  }
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
const photoHeader = (r: ManualResumeInput) => `
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
  @page { size: A4; margin: 15mm; }
  @media print {
    html, body { width: 210mm; height: 297mm; margin: 0; padding: 0; background: white; }
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .content { max-width: initial; width: auto; margin: 0; box-shadow: none; }
    .section { break-inside: avoid; page-break-inside: avoid; }
  }
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
const softPastel = (r: ManualResumeInput) => `
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
  @page { size: A4; margin: 15mm; }
  @media print {
    html, body { width: 210mm; height: 297mm; margin: 0; padding: 0; background: white; }
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .container { max-width: initial; width: auto; margin: 0; box-shadow: none; border-radius: 0; }
    .section { break-inside: avoid; page-break-inside: avoid; }
  }
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
