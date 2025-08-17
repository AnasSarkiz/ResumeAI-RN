import { ManualResumeInput } from '../types/resume';
import {
  escape,
  renderContact,
  renderEducation,
  renderExperience,
  renderSkills,
  A4_STYLES,
} from './templates-helpers';

// 11) Minimalist Columns
const minimalistColumns = (r: ManualResumeInput) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  ${A4_STYLES}
  :root { --accent:#4b5563; --muted:#6b7280; --bg:#ffffff; }
  body { font-family: Inter, sans-serif; padding: 15mm; color:#111827; }
  .container { width: 100%; height: 100%; display:grid; grid-template-columns: 80mm 1fr; gap:10mm; }
  h1 { margin:0; font-size:24px; font-weight:700; }
  .sidebar { border-right:1px solid #e5e7eb; padding-right:8mm; }
  .main { padding-left:5mm; }
  .contact { margin-top:6px; font-size:12px; color:var(--muted); display:flex; flex-wrap:wrap; gap:6px; }
  .section { margin-top:18px; }
  .section h2 { font-size:13px; color:var(--accent); text-transform:uppercase; margin-bottom:8px; }
  .chip { background:#f3f4f6; padding:4px 8px; border-radius:999px; font-size:11px; margin:0 6px 6px 0; display:inline-block; }
  .role { font-weight:600; font-size:14px; }
  .meta { color:var(--muted); font-size:12px; }
  .date { font-size:11px; color:#9ca3af; }
  ul { margin:6px 0 0 16px; padding:0; }
  li { font-size:12px; margin-bottom:4px; }
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
      ${r.summary ? `<div class="section"><h2>Summary</h2><p style="font-size:12px;">${escape(r.summary)}</p></div>` : ''}
      <div class="section"><h2>Experience</h2>${renderExperience(r)}</div>
    </div>
  </div>
</body>
</html>`;

// 12) Bold Accent Line
const boldAccentLine = (r: ManualResumeInput) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  ${A4_STYLES}
  :root { --accent:#ef4444; --muted:#6b7280; }
  body { font-family: 'Segoe UI', sans-serif; padding: 15mm; }
  .container { width: 100%; height: 100%; border-left:8px solid var(--accent); padding-left:10mm; }
  h1 { margin:0; font-size:24px; }
  .contact { margin-top:6px; font-size:12px; color:var(--muted); display:flex; gap:8px; }
  .section { margin-top:18px; }
  .section h2 { color:var(--accent); font-size:14px; text-transform:uppercase; margin-bottom:8px; }
  .role { font-weight:600; font-size:14px; }
  .meta { font-size:12px; color:var(--muted); }
  .date { font-size:11px; color:var(--accent); }
  .chip { background:#fee2e2; color:#b91c1c; padding:4px 8px; border-radius:999px; font-size:11px; margin:0 6px 6px 0; display:inline-block; }
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

// 13) Split Banner
const splitBanner = (r: ManualResumeInput) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  ${A4_STYLES}
  :root { --accent:#0ea5e9; --muted:#6b7280; }
  body { font-family: Inter, sans-serif; padding:0; }
  .banner { display:flex; justify-content:space-between; background:var(--accent); color:white; padding:10mm 15mm; }
  .name { font-size:24px; font-weight:700; }
  .contact { font-size:12px; display:flex; gap:8px; opacity:0.9; }
  .content { width: 100%; height: calc(100% - 50px); padding:15mm; }
  .section { margin-top:18px; }
  .section h2 { color:var(--accent); font-size:13px; text-transform:uppercase; margin-bottom:8px; }
  .role { font-weight:600; font-size:14px; }
  .meta { color:var(--muted); font-size:12px; }
  .date { color:var(--accent); font-size:11px; }
  .chip { background:#e0f2fe; color:#0369a1; padding:4px 8px; border-radius:999px; font-size:11px; margin:0 6px 6px 0; display:inline-block; }
  ul { margin:6px 0 0 16px; padding:0; }
  li { font-size:12px; margin-bottom:4px; }
</style>
</head>
<body>
  <div class="banner">
    <div>
      <div class="name">${escape(r.fullName)}</div>
      ${renderContact(r)}
    </div>
    ${r.title ? `<div class="title" style="align-self:center;font-size:14px;text-transform:uppercase;">${escape(r.title)}</div>` : ''}
  </div>
  <div class="content">
    ${r.summary ? `<div class="section"><h2>About</h2><p style="font-size:12px;">${escape(r.summary)}</p></div>` : ''}
    <div class="section"><h2>Experience</h2>${renderExperience(r)}</div>
    <div class="section"><h2>Education</h2>${renderEducation(r)}</div>
    <div class="section"><h2>Skills</h2>${renderSkills(r)}</div>
  </div>
</body>
</html>`;

// 14) Modern Card Blocks
const modernCardBlocks = (r: ManualResumeInput) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  ${A4_STYLES}
  :root { --accent:#9333ea; --muted:#6b7280; }
  body { font-family: Inter, sans-serif; padding: 15mm; }
  .container { width: 100%; height: 100%; }
  h1 { font-size:24px; margin:0; }
  .contact { margin-top:6px; font-size:12px; color:var(--muted); display:flex; gap:8px; }
  .section { margin-top:18px; }
  .section h2 { color:var(--accent); font-size:13px; margin-bottom:10px; text-transform:uppercase; }
  .card { background:white; border-radius:8px; box-shadow:0 2px 4px rgba(0,0,0,0.05); padding:12px; margin-bottom:10px; }
  .role { font-weight:600; font-size:14px; }
  .meta { font-size:12px; color:var(--muted); }
  .date { font-size:11px; color:var(--accent); }
  .chip { background:#f3e8ff; color:#6d28d9; padding:4px 8px; border-radius:999px; font-size:11px; margin:0 6px 6px 0; display:inline-block; }
  ul { margin:6px 0 0 16px; padding:0; }
  li { font-size:12px; margin-bottom:4px; }
</style>
</head>
<body>
  <div class="container">
    <h1>${escape(r.fullName)}</h1>
    ${renderContact(r)}
    ${r.summary ? `<div class="section"><h2>Summary</h2><div class="card"><p style="font-size:12px;">${escape(r.summary)}</p></div></div>` : ''}
    <div class="section"><h2>Experience</h2>${r.experience
      .map(
        (e) => `<div class="card">
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
</body>
</html>`;

// 15) Elegant Monochrome
const elegantMonochrome = (r: ManualResumeInput) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  ${A4_STYLES}
  body { font-family: 'Georgia', serif; padding: 15mm; }
  .container { width: 100%; height: 100%; }
  h1 { margin:0; font-size:24px; }
  .contact { margin-top:6px; font-size:12px; color:#555; display:flex; gap:8px; }
  .divider { height:1px; background:#ddd; margin:15px 0; }
  .section h2 { font-size:13px; letter-spacing:1px; text-transform:uppercase; color:#000; margin-bottom:8px; }
  .role { font-weight:bold; font-size:14px; }
  .meta { font-size:12px; color:#555; }
  .date { font-size:11px; color:#000; }
  .chip { background:#eee; color:#000; padding:4px 8px; border-radius:4px; font-size:11px; margin:0 6px 6px 0; display:inline-block; }
  ul { margin:6px 0 0 16px; padding:0; }
  li { font-size:12px; margin-bottom:4px; }
</style>
</head>
<body>
  <div class="container">
    <h1>${escape(r.fullName)}</h1>
    ${renderContact(r)}
    <div class="divider"></div>
    ${r.summary ? `<div class="section"><h2>Summary</h2><p style="font-size:12px;">${escape(r.summary)}</p></div>` : ''}
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
const magazineEditorial = (r: ManualResumeInput) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Lato:wght@300;400&display=swap" rel="stylesheet">
<style>
  ${A4_STYLES}
  :root {
    --primary: #2c3e50;
    --secondary: #e74c3c;
    --light: #f8f9fa;
    --dark: #212529;
    --accent: #3498db;
  }
  body {
    font-family: 'Lato', sans-serif;
    line-height: 1.5;
    padding: 15mm;
  }
  .container {
    width: 100%;
    height: 100%;
    box-shadow: 0 5px 15px rgba(0,0,0,0.05);
  }
  .header {
    background: var(--primary);
    color: white;
    padding: 15mm;
  }
  .name {
    font-family: 'Playfair Display', serif;
    font-size: 2.2rem;
    margin: 0;
    line-height: 1;
  }
  .title {
    font-size: 1rem;
    font-weight: 300;
    letter-spacing: 2px;
    text-transform: uppercase;
    opacity: 0.9;
    margin-top: 6px;
  }
  .contact-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    margin-top: 15px;
    font-size: 12px;
  }
  .contact-item {
    display: flex;
    align-items: center;
  }
  .contact-item::before {
    content: "•";
    color: var(--secondary);
    margin-right: 6px;
    font-size: 1.2rem;
  }
  .content {
    padding: 15mm;
  }
  .section {
    margin-bottom: 8mm;
  }
  .section-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.4rem;
    position: relative;
    padding-bottom: 6px;
    margin-bottom: 15px;
  }
  .section-title::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 40px;
    height: 2px;
    background: var(--secondary);
  }
  .summary {
    font-size: 13px;
    line-height: 1.6;
  }
  .experience-item {
    margin-bottom: 20px;
    position: relative;
    padding-left: 20px;
    border-left: 2px solid var(--accent);
  }
  .role {
    font-weight: bold;
    font-size: 14px;
    color: var(--primary);
  }
  .company {
    display: inline-block;
    background: var(--accent);
    color: white;
    padding: 2px 6px;
    border-radius: 3px;
    margin: 5px 0;
    font-size: 12px;
  }
  .date {
    color: var(--secondary);
    font-size: 12px;
    margin-bottom: 6px;
  }
  .skills-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 8px;
  }
  .skill-item {
    background: var(--light);
    padding: 8px 12px;
    border-left: 3px solid var(--secondary);
    font-size: 12px;
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
      ${
        r.summary
          ? `
      <div class="section">
        <h2 class="section-title">Profile</h2>
        <div class="summary">${escape(r.summary)}</div>
      </div>`
          : ''
      }
      
      <div class="section">
        <h2 class="section-title">Experience</h2>
        ${r.experience
          .map(
            (e) => `
          <div class="experience-item">
            <div class="role">${escape(e.jobTitle)}</div>
            <div class="company">${escape(e.company)}</div>
            <div class="date">${escape(e.startDate)} - ${escape(e.endDate || 'Present')}</div>
            ${
              e.description?.length
                ? `
              <ul>${e.description.map((d) => `<li>${escape(d)}</li>`).join('')}</ul>
            `
                : ''
            }
          </div>
        `
          )
          .join('')}
      </div>
      
      ${
        r.education?.length
          ? `
      <div class="section">
        <h2 class="section-title">Education</h2>
        ${r.education
          .map(
            (edu) => `
          <div class="experience-item">
            <div class="role">${escape(edu.degree)}</div>
            <div class="company">${escape(edu.institution)}</div>
            <div class="date">${escape(edu.startDate)} - ${escape(edu.endDate || 'Present')}</div>
            ${edu.description ? `<p>${escape(edu.description)}</p>` : ''}
          </div>
        `
          )
          .join('')}
      </div>`
          : ''
      }
      
      ${
        r.skills?.length
          ? `
      <div class="section">
        <h2 class="section-title">Skills</h2>
        <div class="skills-container">
          ${r.skills
            .map(
              (s) => `
            <div class="skill-item">
              ${escape(s.name)}${s.proficiency ? `<br><small>${escape(s.proficiency)}</small>` : ''}
            </div>
          `
            )
            .join('')}
        </div>
      </div>`
          : ''
      }
    </div>
  </div>
</body>
</html>`;

// 17. Infographic Minimal
const infographicMinimal = (r: ManualResumeInput) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700&family=Open+Sans:wght@300;400&display=swap" rel="stylesheet">
<style>
  ${A4_STYLES}
  :root {
    --primary: #3498db;
    --secondary: #2ecc71;
    --tertiary: #e74c3c;
    --light: #f9f9f9;
    --dark: #34495e;
  }
  body {
    font-family: 'Open Sans', sans-serif;
    padding: 15mm;
  }
  .resume-card {
    width: 100%;
    height: 100%;
    background: white;
    border-radius: 12px;
    overflow: hidden;
  }
  .header {
    background: var(--primary);
    color: white;
    padding: 15mm;
    text-align: center;
  }
  .name {
    font-family: 'Montserrat', sans-serif;
    font-size: 2rem;
    margin: 0;
  }
  .title {
    font-size: 1rem;
    opacity: 0.9;
    margin-top: 6px;
    font-weight: 300;
  }
  .contact-info {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 15px;
    font-size: 12px;
  }
  .content {
    padding: 15mm;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15mm;
  }
  .section {
    margin-bottom: 8mm;
  }
  .section-title {
    font-family: 'Montserrat', sans-serif;
    font-size: 1.2rem;
    color: var(--primary);
    margin-bottom: 15px;
    padding-bottom: 6px;
    border-bottom: 2px dashed var(--secondary);
    position: relative;
  }
  .section-title::after {
    content: "";
    position: absolute;
    bottom: -6px;
    left: 0;
    width: 15px;
    height: 15px;
    background: var(--tertiary);
    border-radius: 50%;
  }
  .experience-item {
    margin-bottom: 20px;
    position: relative;
    padding-left: 20px;
  }
  .experience-item::before {
    content: "";
    position: absolute;
    left: 0;
    top: 8px;
    width: 10px;
    height: 10px;
    border: 2px solid var(--primary);
    border-radius: 50%;
  }
  .role {
    font-weight: bold;
    margin-bottom: 4px;
    font-size: 14px;
  }
  .company {
    color: var(--primary);
    font-size: 12px;
    margin-bottom: 4px;
  }
  .date {
    background: var(--light);
    display: inline-block;
    padding: 2px 8px;
    border-radius: 20px;
    font-size: 11px;
    color: var(--dark);
    margin-bottom: 8px;
  }
  .skill-meter {
    margin-bottom: 12px;
  }
  .skill-name {
    display: flex;
    justify-content: space-between;
    margin-bottom: 4px;
    font-size: 12px;
  }
  .meter-bar {
    height: 6px;
    background: #eee;
    border-radius: 3px;
    overflow: hidden;
  }
  .meter-fill {
    height: 100%;
    background: var(--secondary);
    border-radius: 3px;
  }
  .education-item {
    margin-bottom: 15px;
    padding-left: 15px;
    border-left: 2px solid var(--secondary);
  }
  .degree {
    font-weight: bold;
    margin-bottom: 4px;
    font-size: 14px;
  }
  .institution {
    color: var(--primary);
    font-size: 12px;
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
        ${
          r.summary
            ? `
        <div class="section">
          <h2 class="section-title">Summary</h2>
          <p style="font-size:12px;">${escape(r.summary)}</p>
        </div>`
            : ''
        }
        
        <div class="section">
          <h2 class="section-title">Experience</h2>
          ${r.experience
            .map(
              (e) => `
            <div class="experience-item">
              <div class="role">${escape(e.jobTitle)}</div>
              <div class="company">${escape(e.company)}</div>
              <div class="date">${escape(e.startDate)} - ${escape(e.endDate || 'Present')}</div>
              ${
                e.description?.length
                  ? `
                <ul>${e.description.map((d) => `<li>${escape(d)}</li>`).join('')}</ul>
              `
                  : ''
              }
            </div>
          `
            )
            .join('')}
        </div>
      </div>
      
      <div>
        ${
          r.education?.length
            ? `
        <div class="section">
          <h2 class="section-title">Education</h2>
          ${r.education
            .map(
              (edu) => `
            <div class="education-item">
              <div class="degree">${escape(edu.degree)}</div>
              <div class="institution">${escape(edu.institution)}</div>
              <div class="date">${escape(edu.startDate)} - ${escape(edu.endDate || 'Present')}</div>
              ${edu.description ? `<p style="font-size:12px;">${escape(edu.description)}</p>` : ''}
            </div>
          `
            )
            .join('')}
        </div>`
            : ''
        }
        
        ${
          r.skills?.length
            ? `
        <div class="section">
          <h2 class="section-title">Skills</h2>
          ${r.skills
            .map(
              (s) => `
            <div class="skill-meter">
              <div class="skill-name">
                <span>${escape(s.name)}</span>
                ${s.proficiency ? `<span>${escape(s.proficiency)}</span>` : ''}
              </div>
              <div class="meter-bar">
                <div class="meter-fill" style="width: ${
                  s.proficiency
                    ? s.proficiency.includes('Expert')
                      ? '95%'
                      : s.proficiency.includes('Advanced')
                        ? '85%'
                        : s.proficiency.includes('Intermediate')
                          ? '70%'
                          : s.proficiency.includes('Basic')
                            ? '50%'
                            : '60%'
                    : '60%'
                }"></div>
              </div>
            </div>
          `
            )
            .join('')}
        </div>`
            : ''
        }
      </div>
    </div>
  </div>
</body>
</html>`;

// 18. Asymmetric Layout
const asymmetricLayout = (r: ManualResumeInput) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Raleway:wght@800&family=Source+Sans+Pro:wght@300;400;600&display=swap" rel="stylesheet">
<style>
  ${A4_STYLES}
  :root {
    --primary: #e67e22;
    --secondary: #9b59b6;
    --dark: #2c3e50;
    --light: #ecf0f1;
    --accent: #1abc9c;
  }
  body {
    font-family: 'Source Sans Pro', sans-serif;
    padding: 0;
  }
  .resume-container {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 40% 60%;
  }
  .sidebar {
    background: var(--dark);
    color: white;
    padding: 15mm;
    clip-path: polygon(0 0, 100% 0, 85% 100%, 0% 100%);
  }
  .main-content {
    background: white;
    padding: 15mm;
  }
  .name {
    font-family: 'Raleway', sans-serif;
    font-size: 2rem;
    margin: 0;
    line-height: 1;
  }
  .title {
    font-size: 1rem;
    font-weight: 300;
    margin-top: 8px;
    opacity: 0.9;
  }
  .contact-info {
    margin-top: 8mm;
  }
  .contact-item {
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
  }
  .divider {
    height: 2px;
    background: var(--primary);
    width: 40px;
    margin: 8mm 0;
  }
  .skills-container {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 12px;
  }
  .skill-tag {
    background: var(--primary);
    padding: 4px 8px;
    border-radius: 20px;
    font-size: 11px;
  }
  .section {
    margin-bottom: 8mm;
  }
  .section-title {
    font-family: 'Raleway', sans-serif;
    font-size: 1.2rem;
    color: var(--secondary);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 15px;
    position: relative;
    padding-left: 15px;
  }
  .section-title::before {
    content: "";
    position: absolute;
    left: 0;
    top: 6px;
    height: 20px;
    width: 4px;
    background: var(--accent);
  }
  .experience-item {
    margin-bottom: 20px;
    position: relative;
    padding-left: 20px;
  }
  .experience-item::before {
    content: "";
    position: absolute;
    left: 0;
    top: 8px;
    width: 12px;
    height: 12px;
    border: 3px solid var(--primary);
    border-radius: 50%;
  }
  .role {
    font-weight: bold;
    font-size: 14px;
    margin-bottom: 4px;
  }
  .company {
    color: var(--primary);
    font-size: 12px;
    margin-bottom: 4px;
  }
  .date {
    color: var(--dark);
    opacity: 0.7;
    font-size: 11px;
    margin-bottom: 8px;
    display: block;
  }
  .education-item {
    margin-bottom: 15px;
    padding-left: 15px;
    border-left: 2px solid var(--accent);
  }
  .degree {
    font-weight: bold;
    margin-bottom: 4px;
    font-size: 14px;
  }
  .institution {
    color: var(--secondary);
    font-size: 12px;
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
      
      ${
        r.skills?.length
          ? `
      <div>
        <div class="divider"></div>
        <h3 class="section-title">Skills</h3>
        <div class="skills-container">
          ${r.skills
            .map(
              (s) => `
            <div class="skill-tag">${escape(s.name)}</div>
          `
            )
            .join('')}
        </div>
      </div>`
          : ''
      }
    </aside>
    
    <main class="main-content">
      ${
        r.summary
          ? `
      <div class="section">
        <h2 class="section-title">Profile</h2>
        <p style="font-size:12px;">${escape(r.summary)}</p>
      </div>`
          : ''
      }
      
      <div class="section">
        <h2 class="section-title">Experience</h2>
        ${r.experience
          .map(
            (e) => `
          <div class="experience-item">
            <div class="role">${escape(e.jobTitle)}</div>
            <div class="company">${escape(e.company)}</div>
            <span class="date">${escape(e.startDate)} - ${escape(e.endDate || 'Present')}</span>
            ${
              e.description?.length
                ? `
              <ul>${e.description.map((d) => `<li>${escape(d)}</li>`).join('')}</ul>
            `
                : ''
            }
          </div>
        `
          )
          .join('')}
      </div>
      
      ${
        r.education?.length
          ? `
      <div class="section">
        <h2 class="section-title">Education</h2>
        ${r.education
          .map(
            (edu) => `
          <div class="education-item">
            <div class="degree">${escape(edu.degree)}</div>
            <div class="institution">${escape(edu.institution)}</div>
            <span class="date">${escape(edu.startDate)} - ${escape(edu.endDate || 'Present')}</span>
            ${edu.description ? `<p style="font-size:12px;">${escape(edu.description)}</p>` : ''}
          </div>
        `
          )
          .join('')}
      </div>`
          : ''
      }
    </main>
  </div>
</body>
</html>`;

// 19. Typographic Emphasis
const typographicEmphasis = (r: ManualResumeInput) => `
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
    margin-bottom: 4px;
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
  @page { size: A4; margin: 15mm; }
  @media print {
    html, body { width: 210mm; height: 297mm; margin: 0; padding: 0; background: white; }
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .resume-wrapper { max-width: initial; width: auto; margin: 0; }
    .section, .experience-grid, .education-item { break-inside: avoid; page-break-inside: avoid; }
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
    
    ${
      r.summary
        ? `
    <div class="section" data-number="01">
      <h2 class="section-title">Profile</h2>
      <div class="summary">${escape(r.summary)}</div>
    </div>`
        : ''
    }
    
    <div class="section" data-number="02">
      <h2 class="section-title">Experience</h2>
      ${r.experience
        .map(
          (e) => `
        <div class="experience-grid">
          <div class="date-range">${escape(e.startDate)} - ${escape(e.endDate || 'Present')}</div>
          <div class="experience-details">
            <div class="role">${escape(e.jobTitle)}</div>
            <div class="company">${escape(e.company)}</div>
            ${
              e.description?.length
                ? `
              <ul>${e.description.map((d) => `<li>${escape(d)}</li>`).join('')}</ul>
            `
                : ''
            }
          </div>
        </div>
      `
        )
        .join('')}
    </div>
    
    ${
      r.education?.length
        ? `
    <div class="section" data-number="03">
      <h2 class="section-title">Education</h2>
      ${r.education
        .map(
          (edu) => `
        <div class="education-item">
          <div class="date-range">${escape(edu.startDate)} - ${escape(edu.endDate || 'Present')}</div>
          <div class="degree">${escape(edu.degree)}</div>
          <div class="institution">${escape(edu.institution)}</div>
          ${edu.description ? `<p>${escape(edu.description)}</p>` : ''}
        </div>
      `
        )
        .join('')}
    </div>`
        : ''
    }
    
    ${
      r.skills?.length
        ? `
    <div class="section" data-number="04">
      <h2 class="section-title">Skills</h2>
      <div class="skills-container">
        <div class="skill-category">
          <h4>Technical</h4>
          <div class="skill-items">
            ${r.skills
              .filter((s) => !s.category || s.category === 'Technical')
              .map(
                (s) => `
              <div class="skill-item">${escape(s.name)}</div>
            `
              )
              .join('')}
          </div>
        </div>
        <div class="skill-category">
          <h4>Professional</h4>
          <div class="skill-items">
            ${r.skills
              .filter((s) => s.category === 'Professional')
              .map(
                (s) => `
              <div class="skill-item">${escape(s.name)}</div>
            `
              )
              .join('')}
          </div>
        </div>
      </div>
    </div>`
        : ''
    }
  </div>
</body>
</html>`;

// 20. Geometric Minimalism
const geometricMinimalism = (r: ManualResumeInput) => `
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
    --accent: #1abc9c;
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
  @page { size: A4; margin: 15mm; }
  @media print {
    html, body { width: 210mm; height: 297mm; margin: 0; padding: 0; background: white; }
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .resume-card { max-width: initial; width: auto; margin: 0; box-shadow: none; border-radius: 0; }
    .section, .experience-item, .education-item { break-inside: avoid; page-break-inside: avoid; }
    .geometric-bg { opacity: 1; }
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
        ${
          r.summary
            ? `
        <div class="section">
          <h2 class="section-title">Summary</h2>
          <p>${escape(r.summary)}</p>
        </div>`
            : ''
        }
        
        <div class="section">
          <h2 class="section-title">Experience</h2>
          ${r.experience
            .map(
              (e) => `
            <div class="experience-item">
              <div class="role">${escape(e.jobTitle)}</div>
              <div class="company">${escape(e.company)}</div>
              <div class="date">${escape(e.startDate)} - ${escape(e.endDate || 'Present')}</div>
              ${
                e.description?.length
                  ? `
                <ul>${e.description.map((d) => `<li>${escape(d)}</li>`).join('')}</ul>
              `
                  : ''
              }
            </div>
          `
            )
            .join('')}
        </div>
      </div>
      
      <div>
        ${
          r.education?.length
            ? `
        <div class="section">
          <h2 class="section-title">Education</h2>
          ${r.education
            .map(
              (edu) => `
            <div class="experience-item">
              <div class="role">${escape(edu.degree)}</div>
              <div class="company">${escape(edu.institution)}</div>
              <div class="date">${escape(edu.startDate)} - ${escape(edu.endDate || 'Present')}</div>
              ${edu.description ? `<p>${escape(edu.description)}</p>` : ''}
            </div>
          `
            )
            .join('')}
        </div>`
            : ''
        }
        
        ${
          r.skills?.length
            ? `
        <div class="section">
          <h2 class="section-title">Skills</h2>
          <div class="skills-grid">
            ${r.skills
              .map(
                (s) => `
              <div class="skill-item">${escape(s.name)}</div>
            `
              )
              .join('')}
          </div>
        </div>`
            : ''
        }
      </div>
    </div>
  </div>
</body>
</html>
`;

export {
  minimalistColumns,
  boldAccentLine,
  splitBanner,
  modernCardBlocks,
  elegantMonochrome,
  magazineEditorial,
  infographicMinimal,
  asymmetricLayout,
  typographicEmphasis,
  geometricMinimalism,
};
