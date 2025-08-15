import { ManualResumeInput } from '../types/resume';
import {
  escape,
  renderContact,
  renderEducation,
  renderExperience,
  renderSkills,
} from './templates-helpers';

// 31. Abstract Geometric
const abstractGeometric = (r: ManualResumeInput) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${escape(r.fullName)} - Resume</title>
<style>
  @page { size: A4; margin: 0; }
  body {
    width: 210mm;
    height: 297mm;
    margin: 0;
    padding: 0;
    font-family: 'Segoe UI', sans-serif;
    background: #f0f4f8;
    position: relative;
    overflow: hidden;
  }
  
  .container {
    display: grid;
    grid-template-columns: 70mm 120mm;
    height: 277mm;
    margin: 10mm;
    position: relative;
  }
  
  .sidebar {
    background: #3a506b;
    padding: 15mm;
    color: white;
  }
  
  .geometric-shape {
    position: absolute;
    width: 100mm;
    height: 100mm;
    background: #5bc0be;
    clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
    opacity: 0.1;
    top: -20mm;
    right: -20mm;
  }
  
  .name-title h1 {
    font-size: 24pt;
    margin: 0 0 5mm;
    color: white;
  }
  
  .name-title h2 {
    font-size: 12pt;
    margin: 0;
    color: #5bc0be;
    font-weight: normal;
  }
  
  .contact-info {
    margin: 15mm 0;
  }
  
  .contact-item {
    margin-bottom: 5mm;
    font-size: 10pt;
  }
  
  .section-title {
    font-size: 14pt;
    color: #5bc0be;
    border-bottom: 1px solid rgba(255,255,255,0.3);
    padding-bottom: 2mm;
    margin: 10mm 0 5mm;
  }
  
  .main-content {
    padding: 15mm;
  }
  
  .experience-item {
    margin-bottom: 8mm;
  }
  
  .job-title {
    font-weight: bold;
    font-size: 11pt;
  }
  
  .company {
    font-size: 10pt;
    color: #3a506b;
    margin: 1mm 0;
  }
  
  .date {
    font-size: 9pt;
    color: #7f8c8d;
    margin-bottom: 2mm;
  }
  
  .description {
    font-size: 9pt;
    line-height: 1.6;
  }
  
  .skills-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 3mm;
  }
  
  .skill-item {
    background: rgba(91, 192, 190, 0.1);
    padding: 2mm;
    font-size: 9pt;
    text-align: center;
    border-radius: 2mm;
  }
</style>
</head>
<body>
  <div class="geometric-shape"></div>
  <div class="container">
    <div class="sidebar">
      <div class="name-title">
        <h1>${escape(r.fullName)}</h1>
        ${r.title ? `<h2>${escape(r.title)}</h2>` : ''}
      </div>
      
      <div class="contact-info">
        ${r.email ? `<div class="contact-item">✉ ${escape(r.email)}</div>` : ''}
        ${r.phone ? `<div class="contact-item">📞 ${escape(r.phone)}</div>` : ''}
        ${r.linkedIn ? `<div class="contact-item">🔗 ${escape(r.linkedIn)}</div>` : ''}
      </div>
      
      ${
        r.skills?.length
          ? `
      <div class="section">
        <h3 class="section-title">Skills</h3>
        <div class="skills-grid">
          ${r.skills.map((s) => `<div class="skill-item">${escape(s.name)}</div>`).join('')}
        </div>
      </div>`
          : ''
      }
    </div>
    
    <div class="main-content">
      ${
        r.summary
          ? `
      <div class="section">
        <h3 class="section-title">Profile</h3>
        <div class="description">
          ${escape(r.summary)}
        </div>
      </div>`
          : ''
      }
      
      <div class="section">
        <h3 class="section-title">Experience</h3>
        ${r.experience
          .slice(0, 3)
          .map(
            (e) => `
          <div class="experience-item">
            <div class="job-title">${escape(e.jobTitle)}</div>
            <div class="company">${escape(e.company)}</div>
            <div class="date">${escape(e.startDate)} — ${escape(e.endDate || 'Present')}</div>
            <div class="description">${e.description
              ?.slice(0, 3)
              .map((d) => `• ${escape(d)}`)
              .join('<br>')}</div>
          </div>
        `
          )
          .join('')}
      </div>
      
      ${
        r.education?.length
          ? `
      <div class="section">
        <h3 class="section-title">Education</h3>
        ${r.education
          .map(
            (edu) => `
          <div class="experience-item">
            <div class="job-title">${escape(edu.degree)}</div>
            <div class="company">${escape(edu.institution)}</div>
            <div class="date">${escape(edu.startDate)} — ${escape(edu.endDate || 'Graduated')}</div>
          </div>
        `
          )
          .join('')}
      </div>`
          : ''
      }
    </div>
  </div>
</body>
</html>
`;

// 32. Tech Circuit Board
const techCircuitBoard = (r: ManualResumeInput) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${escape(r.fullName)} - Resume</title>
<style>
  @page { size: A4; margin: 0; }
  body {
    width: 210mm;
    height: 297mm;
    margin: 0;
    padding: 0;
    font-family: 'Fira Code', monospace;
    background: #0a192f;
    color: #ccd6f6;
    position: relative;
    overflow: hidden;
  }
  
  .circuit-lines {
    position: absolute;
    width: 100%;
    height: 100%;
    background: 
      linear-gradient(90deg, 
        transparent 49%, 
        #64ffda 49%, 
        #64ffda 51%, 
        transparent 51%),
      linear-gradient(transparent 49%, 
        #64ffda 49%, 
        #64ffda 51%, 
        transparent 51%);
    background-size: 20mm 20mm;
    opacity: 0.1;
    z-index: -1;
  }
  
  .container {
    width: 180mm;
    height: 277mm;
    margin: 10mm;
    padding: 15mm;
    position: relative;
  }
  
  .header {
    border-bottom: 1px solid #64ffda;
    padding-bottom: 5mm;
    margin-bottom: 10mm;
  }
  
  h1 {
    font-size: 28pt;
    margin: 0;
    color: #64ffda;
  }
  
  h2 {
    font-size: 14pt;
    margin: 2mm 0 0;
    color: #8892b0;
    font-weight: normal;
  }
  
  .contact-info {
    display: flex;
    flex-wrap: wrap;
    gap: 5mm;
    margin-top: 5mm;
    font-size: 9pt;
  }
  
  .contact-item {
    display: flex;
    align-items: center;
  }
  
  .contact-item:before {
    content: ">_";
    margin-right: 2mm;
    color: #64ffda;
  }
  
  .main-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10mm;
  }
  
  .section {
    margin-bottom: 10mm;
  }
  
  .section-title {
    font-size: 16pt;
    color: #64ffda;
    margin: 0 0 5mm;
    position: relative;
    padding-left: 8mm;
  }
  
  .section-title:before {
    content: "//";
    position: absolute;
    left: 0;
    color: #64ffda;
  }
  
  .experience-item {
    margin-bottom: 8mm;
  }
  
  .job-title {
    font-size: 12pt;
    font-weight: bold;
    margin: 0 0 1mm;
  }
  
  .company {
    font-size: 10pt;
    color: #64ffda;
    margin-bottom: 1mm;
  }
  
  .date {
    font-size: 9pt;
    color: #8892b0;
    margin-bottom: 3mm;
  }
  
  .description {
    font-size: 9pt;
    line-height: 1.6;
  }
  
  .description li {
    margin-bottom: 2mm;
    position: relative;
    padding-left: 5mm;
  }
  
  .description li:before {
    content: "=>";
    position: absolute;
    left: 0;
    color: #64ffda;
    font-size: 8pt;
  }
  
  .skills-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 3mm;
  }
  
  .skill-item {
    background: rgba(100, 255, 218, 0.1);
    border: 1px solid #64ffda;
    padding: 2mm;
    font-size: 8pt;
    text-align: center;
    border-radius: 2mm;
  }
</style>
</head>
<body>
  <div class="circuit-lines"></div>
  <div class="container">
    <div class="header">
      <h1>${escape(r.fullName)}</h1>
      ${r.title ? `<h2>${escape(r.title)}</h2>` : ''}
      
      <div class="contact-info">
        ${r.email ? `<div class="contact-item">${escape(r.email)}</div>` : ''}
        ${r.phone ? `<div class="contact-item">${escape(r.phone)}</div>` : ''}
        ${r.linkedIn ? `<div class="contact-item">${escape(r.linkedIn)}</div>` : ''}
      </div>
    </div>
    
    <div class="main-content">
      <div class="left-col">
        ${
          r.summary
            ? `
        <div class="section">
          <h3 class="section-title">Profile</h3>
          <div class="description">
            ${escape(r.summary)}
          </div>
        </div>`
            : ''
        }
        
        ${
          r.skills?.length
            ? `
        <div class="section">
          <h3 class="section-title">Skills</h3>
          <div class="skills-grid">
            ${r.skills.map((s) => `<div class="skill-item">${escape(s.name)}</div>`).join('')}
          </div>
        </div>`
            : ''
        }
      </div>
      
      <div class="right-col">
        <div class="section">
          <h3 class="section-title">Experience</h3>
          ${r.experience
            .slice(0, 3)
            .map(
              (e) => `
            <div class="experience-item">
              <div class="job-title">${escape(e.jobTitle)}</div>
              <div class="company">${escape(e.company)}</div>
              <div class="date">${escape(e.startDate)} — ${escape(e.endDate || 'Present')}</div>
              <ul class="description">
                ${e.description
                  ?.slice(0, 3)
                  .map((d) => `<li>${escape(d)}</li>`)
                  .join('')}
              </ul>
            </div>
          `
            )
            .join('')}
        </div>
        
        ${
          r.education?.length
            ? `
        <div class="section">
          <h3 class="section-title">Education</h3>
          ${r.education
            .map(
              (edu) => `
            <div class="experience-item">
              <div class="job-title">${escape(edu.degree)}</div>
              <div class="company">${escape(edu.institution)}</div>
              <div class="date">${escape(edu.startDate)} — ${escape(edu.endDate || 'Graduated')}</div>
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
</html>
`;

// 33. Minimal Monochrome
const minimalMonochrome = (r: ManualResumeInput) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${escape(r.fullName)} - Resume</title>
<style>
  @page { size: A4; margin: 15mm; }
  body {
    width: 180mm;
    height: 267mm;
    margin: 0;
    padding: 0;
    font-family: 'Helvetica Neue', sans-serif;
    background: white;
    color: #333;
  }
  
  .dot-grid {
    position: absolute;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at center, black 1px, transparent 1px);
    background-size: 5mm 5mm;
    opacity: 0.05;
    z-index: -1;
  }
  
  .header {
    border-bottom: 1px solid black;
    padding-bottom: 5mm;
    margin-bottom: 10mm;
  }
  
  h1 {
    font-size: 24pt;
    margin: 0;
    font-weight: 300;
    letter-spacing: 1px;
  }
  
  h2 {
    font-size: 12pt;
    margin: 2mm 0 0;
    font-weight: normal;
    color: #666;
  }
  
  .contact-info {
    display: flex;
    justify-content: space-between;
    margin-top: 5mm;
    font-size: 9pt;
  }
  
  .main-content {
    display: grid;
    grid-template-columns: 60mm 100mm;
    gap: 20mm;
  }
  
  .section {
    margin-bottom: 10mm;
  }
  
  .section-title {
    font-size: 12pt;
    font-weight: bold;
    margin: 0 0 5mm;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  
  .experience-item {
    margin-bottom: 8mm;
  }
  
  .job-title {
    font-weight: bold;
    font-size: 10pt;
  }
  
  .company {
    font-size: 9pt;
    color: #666;
    margin: 1mm 0;
  }
  
  .date {
    font-size: 8pt;
    color: #999;
    margin-bottom: 2mm;
  }
  
  .description {
    font-size: 9pt;
    line-height: 1.6;
  }
  
  .skills-list {
    columns: 2;
    column-gap: 10mm;
    font-size: 9pt;
  }
  
  .skill-item {
    margin-bottom: 2mm;
    break-inside: avoid;
  }
</style>
</head>
<body>
  <div class="dot-grid"></div>
  <div class="header">
    <h1>${escape(r.fullName)}</h1>
    ${r.title ? `<h2>${escape(r.title)}</h2>` : ''}
    
    <div class="contact-info">
      ${r.email ? `<div>${escape(r.email)}</div>` : ''}
      ${r.phone ? `<div>${escape(r.phone)}</div>` : ''}
      ${r.linkedIn ? `<div>${escape(r.linkedIn)}</div>` : ''}
    </div>
  </div>
  
  <div class="main-content">
    <div class="left-col">
      ${
        r.summary
          ? `
      <div class="section">
        <h3 class="section-title">Profile</h3>
        <div class="description">
          ${escape(r.summary)}
        </div>
      </div>`
          : ''
      }
      
      ${
        r.skills?.length
          ? `
      <div class="section">
        <h3 class="section-title">Skills</h3>
        <div class="skills-list">
          ${r.skills.map((s) => `<div class="skill-item">${escape(s.name)}</div>`).join('')}
        </div>
      </div>`
          : ''
      }
    </div>
    
    <div class="right-col">
      <div class="section">
        <h3 class="section-title">Experience</h3>
        ${r.experience
          .slice(0, 3)
          .map(
            (e) => `
          <div class="experience-item">
            <div class="job-title">${escape(e.jobTitle)}</div>
            <div class="company">${escape(e.company)}</div>
            <div class="date">${escape(e.startDate)} — ${escape(e.endDate || 'Present')}</div>
            <div class="description">${e.description
              ?.slice(0, 3)
              .map((d) => `• ${escape(d)}`)
              .join('<br>')}</div>
          </div>
        `
          )
          .join('')}
      </div>
      
      ${
        r.education?.length
          ? `
      <div class="section">
        <h3 class="section-title">Education</h3>
        ${r.education
          .map(
            (edu) => `
          <div class="experience-item">
            <div class="job-title">${escape(edu.degree)}</div>
            <div class="company">${escape(edu.institution)}</div>
            <div class="date">${escape(edu.startDate)} — ${escape(edu.endDate || 'Graduated')}</div>
          </div>
        `
          )
          .join('')}
      </div>`
          : ''
      }
    </div>
  </div>
</body>
</html>
`;

// 34. Art Gallery
const artGallery = (r: ManualResumeInput) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${escape(r.fullName)} - Resume</title>
<style>
  @page { size: A4; margin: 0; }
  body {
    width: 210mm;
    height: 297mm;
    margin: 0;
    padding: 0;
    font-family: 'Playfair Display', serif;
    background: #f8f1e5;
    color: #333;
  }
  
  .art-border {
    border: 15mm solid #2c3e50;
    height: 267mm;
    position: relative;
  }
  
  .museum-label {
    position: absolute;
    bottom: 10mm;
    right: 10mm;
    font-style: italic;
    color: #7f8c8d;
    font-size: 9pt;
  }
  
  .container {
    padding: 20mm;
  }
  
  .header {
    text-align: center;
    margin-bottom: 15mm;
  }
  
  h1 {
    font-size: 36pt;
    margin: 0;
    font-weight: normal;
    letter-spacing: 1px;
  }
  
  h2 {
    font-size: 14pt;
    margin: 5mm 0 0;
    font-weight: normal;
    color: #7f8c8d;
  }
  
  .section {
    margin-bottom: 15mm;
  }
  
  .section-title {
    font-size: 16pt;
    font-variant: small-caps;
    letter-spacing: 2px;
    margin: 0 0 5mm;
    color: #2c3e50;
  }
  
  .experience-item {
    margin-bottom: 10mm;
  }
  
  .job-title {
    font-size: 12pt;
    font-weight: bold;
  }
  
  .company {
    font-size: 10pt;
    font-style: italic;
    color: #7f8c8d;
    margin: 1mm 0;
  }
  
  .date {
    font-size: 9pt;
    color: #95a5a6;
    margin-bottom: 3mm;
  }
  
  .description {
    font-size: 10pt;
    line-height: 1.8;
  }
  
  .contact-info {
    display: flex;
    justify-content: center;
    gap: 10mm;
    margin-top: 10mm;
    font-size: 9pt;
  }
  
  .skills-list {
    columns: 2;
    column-gap: 15mm;
    font-size: 10pt;
  }
</style>
</head>
<body>
  <div class="art-border">
    <div class="container">
      <div class="header">
        <h1>${escape(r.fullName)}</h1>
        ${r.title ? `<h2>${escape(r.title)}</h2>` : ''}
      </div>
      
      <div class="contact-info">
        ${r.email ? `<div>${escape(r.email)}</div>` : ''}
        ${r.phone ? `<div>${escape(r.phone)}</div>` : ''}
        ${r.linkedIn ? `<div>${escape(r.linkedIn)}</div>` : ''}
      </div>
      
      ${
        r.summary
          ? `
      <div class="section">
        <h3 class="section-title">Statement</h3>
        <div class="description">
          ${escape(r.summary)}
        </div>
      </div>`
          : ''
      }
      
      <div class="section">
        <h3 class="section-title">Exhibitions</h3>
        ${r.experience
          .slice(0, 2)
          .map(
            (e) => `
          <div class="experience-item">
            <div class="job-title">${escape(e.jobTitle)}</div>
            <div class="company">${escape(e.company)}</div>
            <div class="date">${escape(e.startDate)} — ${escape(e.endDate || 'Ongoing')}</div>
            <div class="description">${e.description
              ?.slice(0, 2)
              .map((d) => `• ${escape(d)}`)
              .join('<br>')}</div>
          </div>
        `
          )
          .join('')}
      </div>
      
      ${
        r.skills?.length
          ? `
      <div class="section">
        <h3 class="section-title">Techniques</h3>
        <div class="skills-list">
          ${r.skills.map((s) => `<div>${escape(s.name)}</div>`).join('')}
        </div>
      </div>`
          : ''
      }
      
      ${
        r.education?.length
          ? `
      <div class="section">
        <h3 class="section-title">Education</h3>
        ${r.education
          .map(
            (edu) => `
          <div class="experience-item">
            <div class="job-title">${escape(edu.degree)}</div>
            <div class="company">${escape(edu.institution)}</div>
            <div class="date">${escape(edu.startDate)} — ${escape(edu.endDate || 'Present')}</div>
          </div>
        `
          )
          .join('')}
      </div>`
          : ''
      }
    </div>
    
    <div class="museum-label">${escape(r.fullName)} · ${new Date().getFullYear()}</div>
  </div>
</body>
</html>`;

// 35. Polaroid Memories
const polaroidMemories = (r: ManualResumeInput) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${escape(r.fullName)} - Resume</title>
<style>
  @page { size: A4; margin: 0; }
  body {
    width: 210mm;
    height: 297mm;
    margin: 0;
    padding: 0;
    font-family: 'Courier New', monospace;
    background: #dfe6e9;
    position: relative;
    overflow: hidden;
  }
  
  .container {
    width: 190mm;
    height: 277mm;
    margin: 10mm;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10mm;
    align-content: start;
  }
  
  .polaroid {
    background: white;
    padding: 5mm 5mm 15mm;
    box-shadow: 0 2mm 5mm rgba(0,0,0,0.2);
    transform: rotate(${Math.random() * 6 - 3}deg);
    margin-bottom: 10mm;
    position: relative;
  }
  
  .polaroid:nth-child(even) {
    transform: rotate(${Math.random() * 6 - 3}deg);
  }
  
  .polaroid:after {
    content: '';
    position: absolute;
    bottom: 5mm;
    left: 0;
    right: 0;
    height: 1px;
    background: #ddd;
  }
  
  .polaroid-title {
    font-weight: bold;
    font-size: 12pt;
    margin: 0 0 3mm;
  }
  
  .polaroid-subtitle {
    font-size: 9pt;
    color: #7f8c8d;
    margin: 0 0 5mm;
  }
  
  .polaroid-content {
    font-size: 9pt;
    line-height: 1.6;
  }
  
  .polaroid-content ul {
    padding-left: 5mm;
  }
  
  .name-plate {
    grid-column: 1 / -1;
    text-align: center;
    margin-bottom: 5mm;
  }
  
  h1 {
    font-size: 24pt;
    margin: 0;
    letter-spacing: 1px;
  }
  
  h2 {
    font-size: 12pt;
    margin: 2mm 0 0;
    font-weight: normal;
    color: #7f8c8d;
  }
  
  .contact-info {
    grid-column: 1 / -1;
    display: flex;
    justify-content: center;
    gap: 10mm;
    font-size: 9pt;
    margin-bottom: 10mm;
  }
</style>
</head>
<body>
  <div class="container">
    <div class="name-plate">
      <h1>${escape(r.fullName)}</h1>
      ${r.title ? `<h2>${escape(r.title)}</h2>` : ''}
    </div>
    
    <div class="contact-info">
      ${r.email ? `<div>${escape(r.email)}</div>` : ''}
      ${r.phone ? `<div>${escape(r.phone)}</div>` : ''}
      ${r.linkedIn ? `<div>${escape(r.linkedIn)}</div>` : ''}
    </div>
    
    ${
      r.summary
        ? `
    <div class="polaroid">
      <div class="polaroid-title">Profile</div>
      <div class="polaroid-content">
        ${escape(r.summary)}
      </div>
    </div>`
        : ''
    }
    
    ${r.experience
      .slice(0, 3)
      .map(
        (e) => `
      <div class="polaroid">
        <div class="polaroid-title">${escape(e.jobTitle)}</div>
        <div class="polaroid-subtitle">${escape(e.company)} · ${escape(e.startDate)} — ${escape(e.endDate || 'Present')}</div>
        <div class="polaroid-content">
          <ul>
            ${e.description
              ?.slice(0, 2)
              .map((d) => `<li>${escape(d)}</li>`)
              .join('')}
          </ul>
        </div>
      </div>
    `
      )
      .join('')}
    
    ${
      r.education?.length
        ? `
    <div class="polaroid">
      <div class="polaroid-title">Education</div>
      ${r.education
        .map(
          (edu) => `
        <div class="polaroid-content">
          <strong>${escape(edu.degree)}</strong><br>
          ${escape(edu.institution)}<br>
          ${escape(edu.startDate)} — ${escape(edu.endDate || 'Present')}
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
    <div class="polaroid">
      <div class="polaroid-title">Skills</div>
      <div class="polaroid-content">
        ${r.skills.map((s) => `• ${escape(s.name)}`).join('<br>')}
      </div>
    </div>`
        : ''
    }
  </div>
</body>
</html>`;

// 36. Sunset Gradient
const sunsetGradient = (r: ManualResumeInput) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${escape(r.fullName)} - Resume</title>
<style>
  @page { size: A4; margin: 0; }
  body {
    width: 210mm;
    height: 297mm;
    margin: 0;
    padding: 0;
    font-family: 'Montserrat', sans-serif;
    background: linear-gradient(135deg, #ff7e5f, #feb47b);
    color: #333;
    position: relative;
    overflow: hidden;
  }
  
  .container {
    width: 190mm;
    height: 277mm;
    margin: 10mm;
    background: rgba(255,255,255,0.9);
    box-shadow: 0 0 20mm rgba(0,0,0,0.1);
    padding: 15mm;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10mm;
    padding-bottom: 5mm;
    border-bottom: 2px solid #ff7e5f;
  }
  
  h1 {
    font-size: 28pt;
    margin: 0;
    color: #ff7e5f;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  
  h2 {
    font-size: 14pt;
    margin: 2mm 0 0;
    color: #666;
    font-weight: normal;
  }
  
  .contact-info {
    text-align: right;
    font-size: 9pt;
  }
  
  .contact-item {
    margin-bottom: 2mm;
  }
  
  .main-content {
    display: grid;
    grid-template-columns: 70mm 100mm;
    gap: 20mm;
  }
  
  .section {
    margin-bottom: 10mm;
  }
  
  .section-title {
    font-size: 16pt;
    color: #ff7e5f;
    margin: 0 0 5mm;
    position: relative;
    padding-left: 10mm;
  }
  
  .section-title:before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 8mm;
    height: 8mm;
    background: #feb47b;
    border-radius: 50%;
  }
  
  .experience-item {
    margin-bottom: 8mm;
  }
  
  .job-title {
    font-weight: bold;
    font-size: 12pt;
    color: #ff7e5f;
  }
  
  .company {
    font-size: 10pt;
    color: #666;
    margin: 1mm 0;
  }
  
  .date {
    font-size: 9pt;
    color: #999;
    margin-bottom: 3mm;
  }
  
  .description {
    font-size: 9pt;
    line-height: 1.6;
  }
  
  .description li {
    margin-bottom: 2mm;
    position: relative;
    padding-left: 5mm;
  }
  
  .description li:before {
    content: '•';
    position: absolute;
    left: 0;
    color: #feb47b;
  }
  
  .skills-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 3mm;
  }
  
  .skill-item {
    background: rgba(255,126,95,0.1);
    padding: 2mm;
    font-size: 9pt;
    text-align: center;
    border-radius: 3mm;
    border-left: 3px solid #ff7e5f;
  }
</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="name-title">
        <h1>${escape(r.fullName)}</h1>
        ${r.title ? `<h2>${escape(r.title)}</h2>` : ''}
      </div>
      
      <div class="contact-info">
        ${r.email ? `<div class="contact-item">✉ ${escape(r.email)}</div>` : ''}
        ${r.phone ? `<div class="contact-item">📞 ${escape(r.phone)}</div>` : ''}
        ${r.linkedIn ? `<div class="contact-item">🔗 ${escape(r.linkedIn)}</div>` : ''}
      </div>
    </div>
    
    <div class="main-content">
      <div class="left-col">
        ${
          r.summary
            ? `
        <div class="section">
          <h3 class="section-title">Profile</h3>
          <div class="description">
            ${escape(r.summary)}
          </div>
        </div>`
            : ''
        }
        
        ${
          r.skills?.length
            ? `
        <div class="section">
          <h3 class="section-title">Skills</h3>
          <div class="skills-grid">
            ${r.skills.map((s) => `<div class="skill-item">${escape(s.name)}</div>`).join('')}
          </div>
        </div>`
            : ''
        }
      </div>
      
      <div class="right-col">
        <div class="section">
          <h3 class="section-title">Experience</h3>
          ${r.experience
            .slice(0, 3)
            .map(
              (e) => `
            <div class="experience-item">
              <div class="job-title">${escape(e.jobTitle)}</div>
              <div class="company">${escape(e.company)}</div>
              <div class="date">${escape(e.startDate)} — ${escape(e.endDate || 'Present')}</div>
              <ul class="description">
                ${e.description
                  ?.slice(0, 3)
                  .map((d) => `<li>${escape(d)}</li>`)
                  .join('')}
              </ul>
            </div>
          `
            )
            .join('')}
        </div>
        
        ${
          r.education?.length
            ? `
        <div class="section">
          <h3 class="section-title">Education</h3>
          ${r.education
            .map(
              (edu) => `
            <div class="experience-item">
              <div class="job-title">${escape(edu.degree)}</div>
              <div class="company">${escape(edu.institution)}</div>
              <div class="date">${escape(edu.startDate)} — ${escape(edu.endDate || 'Graduated')}</div>
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
</html>
`;

// 37. Emerald Elegance
const emeraldElegance = (r: ManualResumeInput) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${escape(r.fullName)} - Resume</title>
<style>
  @page { size: A4; margin: 0; }
  body {
    width: 210mm;
    height: 297mm;
    margin: 0;
    padding: 0;
    font-family: 'Cormorant Garamond', serif;
    background: #f8f8f8;
    position: relative;
  }
  
  .emerald-bar {
    position: absolute;
    left: 0;
    top: 0;
    width: 30mm;
    height: 100%;
    background: #2ecc71;
  }
  
  .container {
    width: 180mm;
    height: 277mm;
    margin: 10mm 10mm 10mm 40mm;
    position: relative;
  }
  
  .header {
    margin-bottom: 15mm;
  }
  
  h1 {
    font-size: 32pt;
    margin: 0;
    color: #2ecc71;
    font-weight: 600;
    letter-spacing: 1px;
  }
  
  h2 {
    font-size: 14pt;
    margin: 2mm 0 0;
    color: #555;
    font-weight: normal;
    font-style: italic;
  }
  
  .contact-info {
    display: flex;
    flex-wrap: wrap;
    gap: 5mm;
    margin-top: 5mm;
    font-size: 10pt;
  }
  
  .contact-item {
    display: flex;
    align-items: center;
  }
  
  .contact-item:before {
    content: '';
    display: inline-block;
    width: 4mm;
    height: 4mm;
    background: #2ecc71;
    margin-right: 2mm;
  }
  
  .main-content {
    display: grid;
    grid-template-columns: 1fr;
    gap: 10mm;
  }
  
  .section {
    margin-bottom: 10mm;
  }
  
  .section-title {
    font-size: 18pt;
    color: #2ecc71;
    margin: 0 0 5mm;
    position: relative;
    padding-bottom: 2mm;
    border-bottom: 1px solid #2ecc71;
  }
  
  .experience-item {
    margin-bottom: 10mm;
  }
  
  .job-title {
    font-size: 14pt;
    font-weight: bold;
    margin: 0 0 1mm;
  }
  
  .company {
    font-size: 11pt;
    color: #2ecc71;
    margin-bottom: 1mm;
    font-style: italic;
  }
  
  .date {
    font-size: 10pt;
    color: #777;
    margin-bottom: 3mm;
  }
  
  .description {
    font-size: 10pt;
    line-height: 1.8;
  }
  
  .description li {
    margin-bottom: 2mm;
    position: relative;
    padding-left: 5mm;
  }
  
  .description li:before {
    content: '▹';
    position: absolute;
    left: 0;
    color: #2ecc71;
  }
  
  .skills-list {
    columns: 2;
    column-gap: 15mm;
    font-size: 10pt;
  }
  
  .skill-item {
    margin-bottom: 3mm;
    break-inside: avoid;
  }
</style>
</head>
<body>
  <div class="emerald-bar"></div>
  <div class="container">
    <div class="header">
      <h1>${escape(r.fullName)}</h1>
      ${r.title ? `<h2>${escape(r.title)}</h2>` : ''}
      
      <div class="contact-info">
        ${r.email ? `<div class="contact-item">${escape(r.email)}</div>` : ''}
        ${r.phone ? `<div class="contact-item">${escape(r.phone)}</div>` : ''}
        ${r.linkedIn ? `<div class="contact-item">${escape(r.linkedIn)}</div>` : ''}
      </div>
    </div>
    
    <div class="main-content">
      ${
        r.summary
          ? `
      <div class="section">
        <h3 class="section-title">Profile</h3>
        <div class="description">
          ${escape(r.summary)}
        </div>
      </div>`
          : ''
      }
      
      <div class="section">
        <h3 class="section-title">Experience</h3>
        ${r.experience
          .slice(0, 3)
          .map(
            (e) => `
          <div class="experience-item">
            <div class="job-title">${escape(e.jobTitle)}</div>
            <div class="company">${escape(e.company)}</div>
            <div class="date">${escape(e.startDate)} — ${escape(e.endDate || 'Present')}</div>
            <ul class="description">
              ${e.description
                ?.slice(0, 3)
                .map((d) => `<li>${escape(d)}</li>`)
                .join('')}
            </ul>
          </div>
        `
          )
          .join('')}
      </div>
      
      ${
        r.skills?.length
          ? `
      <div class="section">
        <h3 class="section-title">Skills</h3>
        <div class="skills-list">
          ${r.skills.map((s) => `<div class="skill-item">• ${escape(s.name)}</div>`).join('')}
        </div>
      </div>`
          : ''
      }
      
      ${
        r.education?.length
          ? `
      <div class="section">
        <h3 class="section-title">Education</h3>
        ${r.education
          .map(
            (edu) => `
          <div class="experience-item">
            <div class="job-title">${escape(edu.degree)}</div>
            <div class="company">${escape(edu.institution)}</div>
            <div class="date">${escape(edu.startDate)} — ${escape(edu.endDate || 'Graduated')}</div>
          </div>
        `
          )
          .join('')}
      </div>`
          : ''
      }
    </div>
  </div>
</body>
</html>`;

// 38. Royal Purple
const royalPurple = (r: ManualResumeInput) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${escape(r.fullName)} - Resume</title>
<style>
  @page { size: A4; margin: 0; }
  body {
    width: 210mm;
    height: 297mm;
    margin: 0;
    padding: 0;
    font-family: 'Garamond', serif;
    background: #f9f4ff;
    position: relative;
  }
  
  .container {
    width: 180mm;
    height: 257mm;
    margin: 20mm;
    padding: 20mm;
    background: white;
    box-shadow: 0 0 20mm rgba(0,0,0,0.1);
    border: 1px solid #9b59b6;
  }
  
  .header {
    text-align: center;
    margin-bottom: 15mm;
    position: relative;
  }
  
  .header:after {
    content: '';
    position: absolute;
    bottom: -10mm;
    left: 25%;
    width: 50%;
    height: 2px;
    background: linear-gradient(to right, transparent, #9b59b6, transparent);
  }
  
  h1 {
    font-size: 36pt;
    margin: 0;
    color: #8e44ad;
    letter-spacing: 1px;
  }
  
  h2 {
    font-size: 14pt;
    margin: 2mm 0 0;
    color: #555;
    font-weight: normal;
  }
  
  .contact-info {
    display: flex;
    justify-content: center;
    gap: 10mm;
    margin-top: 5mm;
    font-size: 10pt;
  }
  
  .main-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15mm;
  }
  
  .section {
    margin-bottom: 15mm;
  }
  
  .section-title {
    font-size: 16pt;
    color: #8e44ad;
    margin: 0 0 5mm;
    position: relative;
    padding-bottom: 2mm;
  }
  
  .section-title:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 30mm;
    height: 1px;
    background: #8e44ad;
  }
  
  .experience-item {
    margin-bottom: 10mm;
  }
  
  .job-title {
    font-size: 12pt;
    font-weight: bold;
    margin: 0 0 1mm;
  }
  
  .company {
    font-size: 11pt;
    color: #8e44ad;
    margin-bottom: 1mm;
  }
  
  .date {
    font-size: 10pt;
    color: #777;
    margin-bottom: 3mm;
    font-style: italic;
  }
  
  .description {
    font-size: 10pt;
    line-height: 1.6;
  }
  
  .description li {
    margin-bottom: 2mm;
  }
  
  .skills-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 3mm;
  }
  
  .skill-item {
    background: rgba(155, 89, 182, 0.1);
    padding: 2mm;
    font-size: 9pt;
    text-align: center;
    border-radius: 2mm;
    border: 1px dashed #9b59b6;
  }
</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${escape(r.fullName)}</h1>
      ${r.title ? `<h2>${escape(r.title)}</h2>` : ''}
      
      <div class="contact-info">
        ${r.email ? `<div>✉ ${escape(r.email)}</div>` : ''}
        ${r.phone ? `<div>📞 ${escape(r.phone)}</div>` : ''}
        ${r.linkedIn ? `<div>🔗 ${escape(r.linkedIn)}</div>` : ''}
      </div>
    </div>
    
    <div class="main-content">
      <div class="left-col">
        ${
          r.summary
            ? `
        <div class="section">
          <h3 class="section-title">Profile</h3>
          <div class="description">
            ${escape(r.summary)}
          </div>
        </div>`
            : ''
        }
        
        ${
          r.skills?.length
            ? `
        <div class="section">
          <h3 class="section-title">Skills</h3>
          <div class="skills-grid">
            ${r.skills.map((s) => `<div class="skill-item">${escape(s.name)}</div>`).join('')}
          </div>
        </div>`
            : ''
        }
      </div>
      
      <div class="right-col">
        <div class="section">
          <h3 class="section-title">Experience</h3>
          ${r.experience
            .slice(0, 3)
            .map(
              (e) => `
            <div class="experience-item">
              <div class="job-title">${escape(e.jobTitle)}</div>
              <div class="company">${escape(e.company)}</div>
              <div class="date">${escape(e.startDate)} — ${escape(e.endDate || 'Present')}</div>
              <ul class="description">
                ${e.description
                  ?.slice(0, 3)
                  .map((d) => `<li>${escape(d)}</li>`)
                  .join('')}
              </ul>
            </div>
          `
            )
            .join('')}
        </div>
        
        ${
          r.education?.length
            ? `
        <div class="section">
          <h3 class="section-title">Education</h3>
          ${r.education
            .map(
              (edu) => `
            <div class="experience-item">
              <div class="job-title">${escape(edu.degree)}</div>
              <div class="company">${escape(edu.institution)}</div>
              <div class="date">${escape(edu.startDate)} — ${escape(edu.endDate || 'Graduated')}</div>
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

// 39. Ocean Depth
const oceanDepth = (r: ManualResumeInput) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${escape(r.fullName)} - Resume</title>
<style>
  @page { size: A4; margin: 0; }
  body {
    width: 210mm;
    height: 297mm;
    margin: 0;
    padding: 0;
    font-family: 'Open Sans', sans-serif;
    background: linear-gradient(to bottom, #1e3c72, #2a5298);
    color: white;
    position: relative;
    overflow: hidden;
  }
  
  .wave {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50mm;
    background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 1200 120" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"><path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill="rgba(255,255,255,0.1)" opacity=".25"/><path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" fill="rgba(255,255,255,0.1)" opacity=".5"/><path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="rgba(255,255,255,0.1)"/></svg>');
    background-size: cover;
    z-index: -1;
  }
  
  .container {
    width: 180mm;
    height: 257mm;
    margin: 20mm;
    background: rgba(255,255,255,0.9);
    color: #333;
    padding: 15mm;
    box-shadow: 0 0 20mm rgba(0,0,0,0.2);
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10mm;
    padding-bottom: 5mm;
    border-bottom: 2px solid #1e3c72;
  }
  
  h1 {
    font-size: 28pt;
    margin: 0;
    color: #1e3c72;
  }
  
  h2 {
    font-size: 14pt;
    margin: 2mm 0 0;
    color: #2a5298;
    font-weight: normal;
  }
  
  .contact-info {
    text-align: right;
    font-size: 9pt;
  }
  
  .contact-item {
    margin-bottom: 2mm;
  }
  
  .main-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15mm;
  }
  
  .section {
    margin-bottom: 10mm;
  }
  
  .section-title {
    font-size: 16pt;
    color: #1e3c72;
    margin: 0 0 5mm;
    position: relative;
    padding-left: 10mm;
  }
  
  .section-title:before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 8mm;
    height: 2mm;
    background: #2a5298;
  }
  
  .experience-item {
    margin-bottom: 8mm;
  }
  
  .job-title {
    font-weight: bold;
    font-size: 12pt;
    color: #1e3c72;
  }
  
  .company {
    font-size: 10pt;
    color: #666;
    margin: 1mm 0;
  }
  
  .date {
    font-size: 9pt;
    color: #999;
    margin-bottom: 3mm;
  }
  
  .description {
    font-size: 9pt;
    line-height: 1.6;
  }
  
  .skills-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 3mm;
  }
  
  .skill-item {
    background: rgba(30, 60, 114, 0.1);
    padding: 2mm;
    font-size: 9pt;
    text-align: center;
    border-radius: 2mm;
    border-left: 3px solid #1e3c72;
  }
</style>
</head>
<body>
  <div class="wave"></div>
  <div class="container">
    <div class="header">
      <div class="name-title">
        <h1>${escape(r.fullName)}</h1>
        ${r.title ? `<h2>${escape(r.title)}</h2>` : ''}
      </div>
      
      <div class="contact-info">
        ${r.email ? `<div class="contact-item">✉ ${escape(r.email)}</div>` : ''}
        ${r.phone ? `<div class="contact-item">📞 ${escape(r.phone)}</div>` : ''}
        ${r.linkedIn ? `<div class="contact-item">🔗 ${escape(r.linkedIn)}</div>` : ''}
      </div>
    </div>
    
    <div class="main-content">
      <div class="left-col">
        ${
          r.summary
            ? `
        <div class="section">
          <h3 class="section-title">Profile</h3>
          <div class="description">
            ${escape(r.summary)}
          </div>
        </div>`
            : ''
        }
        
        ${
          r.skills?.length
            ? `
        <div class="section">
          <h3 class="section-title">Skills</h3>
          <div class="skills-grid">
            ${r.skills.map((s) => `<div class="skill-item">${escape(s.name)}</div>`).join('')}
          </div>
        </div>`
            : ''
        }
      </div>
      
      <div class="right-col">
        <div class="section">
          <h3 class="section-title">Experience</h3>
          ${r.experience
            .slice(0, 3)
            .map(
              (e) => `
            <div class="experience-item">
              <div class="job-title">${escape(e.jobTitle)}</div>
              <div class="company">${escape(e.company)}</div>
              <div class="date">${escape(e.startDate)} — ${escape(e.endDate || 'Present')}</div>
              <ul class="description">
                ${e.description
                  ?.slice(0, 3)
                  .map((d) => `<li>${escape(d)}</li>`)
                  .join('')}
              </ul>
            </div>
          `
            )
            .join('')}
        </div>
        
        ${
          r.education?.length
            ? `
        <div class="section">
          <h3 class="section-title">Education</h3>
          ${r.education
            .map(
              (edu) => `
            <div class="experience-item">
              <div class="job-title">${escape(edu.degree)}</div>
              <div class="company">${escape(edu.institution)}</div>
              <div class="date">${escape(edu.startDate)} — ${escape(edu.endDate || 'Graduated')}</div>
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

// 40. Golden Luxury
const goldenLuxury = (r: ManualResumeInput) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${escape(r.fullName)} - Resume</title>
<style>
  @page { size: A4; margin: 0; }
  body {
    width: 210mm;
    height: 297mm;
    margin: 0;
    padding: 0;
    font-family: 'Times New Roman', serif;
    background: #fafafa;
    position: relative;
  }
  
  .gold-bar {
    position: absolute;
    left: 0;
    top: 0;
    width: 10mm;
    height: 100%;
    background: linear-gradient(to bottom, #D4AF37, #F9D423);
  }
  
  .container {
    width: 190mm;
    height: 277mm;
    margin: 10mm 10mm 10mm 20mm;
    position: relative;
  }
  
  .header {
    text-align: center;
    margin-bottom: 15mm;
    padding-bottom: 5mm;
    border-bottom: 1px solid #D4AF37;
  }
  
  h1 {
    font-size: 36pt;
    margin: 0;
    color: #D4AF37;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
  
  h2 {
    font-size: 14pt;
    margin: 2mm 0 0;
    color: #777;
    font-weight: normal;
    font-style: italic;
  }
  
  .contact-info {
    display: flex;
    justify-content: center;
    gap: 10mm;
    margin-top: 5mm;
    font-size: 10pt;
  }
  
  .main-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15mm;
  }
  
  .section {
    margin-bottom: 10mm;
  }
  
  .section-title {
    font-size: 16pt;
    color: #D4AF37;
    margin: 0 0 5mm;
    position: relative;
    padding-bottom: 2mm;
  }
  
  .section-title:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 30mm;
    height: 1px;
    background: linear-gradient(to right, #D4AF37, transparent);
  }
  
  .experience-item {
    margin-bottom: 10mm;
  }
  
  .job-title {
    font-size: 12pt;
    font-weight: bold;
    margin: 0 0 1mm;
  }
  
  .company {
    font-size: 11pt;
    color: #D4AF37;
    margin-bottom: 1mm;
  }
  
  .date {
    font-size: 10pt;
    color: #777;
    margin-bottom: 3mm;
    font-style: italic;
  }
  
  .description {
    font-size: 10pt;
    line-height: 1.6;
  }
  
  .description li {
    margin-bottom: 2mm;
    position: relative;
    padding-left: 5mm;
  }
  
  .description li:before {
    content: '•';
    position: absolute;
    left: 0;
    color: #D4AF37;
  }
  
  .skills-list {
    columns: 2;
    column-gap: 15mm;
    font-size: 10pt;
  }
  
  .skill-item {
    margin-bottom: 3mm;
    break-inside: avoid;
  }
</style>
</head>
<body>
  <div class="gold-bar"></div>
  <div class="container">
    <div class="header">
      <h1>${escape(r.fullName)}</h1>
      ${r.title ? `<h2>${escape(r.title)}</h2>` : ''}
      
      <div class="contact-info">
        ${r.email ? `<div>✉ ${escape(r.email)}</div>` : ''}
        ${r.phone ? `<div>📞 ${escape(r.phone)}</div>` : ''}
        ${r.linkedIn ? `<div>🔗 ${escape(r.linkedIn)}</div>` : ''}
      </div>
    </div>
    
    <div class="main-content">
      <div class="left-col">
        ${
          r.summary
            ? `
        <div class="section">
          <h3 class="section-title">Profile</h3>
          <div class="description">
            ${escape(r.summary)}
          </div>
        </div>`
            : ''
        }
        
        ${
          r.skills?.length
            ? `
        <div class="section">
          <h3 class="section-title">Skills</h3>
          <div class="skills-list">
            ${r.skills.map((s) => `<div class="skill-item">• ${escape(s.name)}</div>`).join('')}
          </div>
        </div>`
            : ''
        }
      </div>
      
      <div class="right-col">
        <div class="section">
          <h3 class="section-title">Experience</h3>
          ${r.experience
            .slice(0, 3)
            .map(
              (e) => `
            <div class="experience-item">
              <div class="job-title">${escape(e.jobTitle)}</div>
              <div class="company">${escape(e.company)}</div>
              <div class="date">${escape(e.startDate)} — ${escape(e.endDate || 'Present')}</div>
              <ul class="description">
                ${e.description
                  ?.slice(0, 3)
                  .map((d) => `<li>${escape(d)}</li>`)
                  .join('')}
              </ul>
            </div>
          `
            )
            .join('')}
        </div>
        
        ${
          r.education?.length
            ? `
        <div class="section">
          <h3 class="section-title">Education</h3>
          ${r.education
            .map(
              (edu) => `
            <div class="experience-item">
              <div class="job-title">${escape(edu.degree)}</div>
              <div class="company">${escape(edu.institution)}</div>
              <div class="date">${escape(edu.startDate)} — ${escape(edu.endDate || 'Graduated')}</div>
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
</html>
`;

export {
  abstractGeometric,
  techCircuitBoard,
  minimalMonochrome,
  royalPurple,
  oceanDepth,
  emeraldElegance,
  goldenLuxury,
  sunsetGradient,
  artGallery,
  polaroidMemories,
};
