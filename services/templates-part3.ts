import { ManualResumeInput } from '../types/resume';
import {
  escape,
  renderContact,
  renderEducation,
  renderExperience,
  renderSkills,
  A4_STYLES,
} from './templates-helpers';
// 21. Hexagonal Grid
const hexagonalGrid = (r: ManualResumeInput) => `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:wght@300;400;600&display=swap" rel="stylesheet">
<style>
  ${A4_STYLES}
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
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .container {
      max-width: initial;
      width: auto;
      min-height: auto;
      margin: 0;
      box-shadow: none;
      border-radius: 0;
    }
    .hex-grid,
    .hex-section,
    .experience-item {
      break-inside: avoid;
      page-break-inside: avoid;
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
        ${
          r.summary
            ? `
        <div class="hex-section">
          <h2 class="section-title">Summary</h2>
          <div class="summary-text">${escape(r.summary)}</div>
        </div>`
            : ''
        }
        
        <div class="hex-section">
          <h2 class="section-title">Experience</h2>
          ${r.experience
            .map(
              (e) => `
            <div class="experience-item">
              <div class="job-title">${escape(e.jobTitle)}</div>
              <div class="company">${escape(e.company)}</div>
              <div class="date">${escape(e.startDate)} - ${escape(e.endDate || 'Present')}</div>
              ${
                e.description?.length
                  ? `
                <div class="description">
                  <ul>${e.description.map((d) => `<li>${escape(d)}</li>`).join('')}</ul>
                </div>
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
        <div class="hex-section">
          <h2 class="section-title">Education</h2>
          ${r.education
            .map(
              (edu) => `
            <div class="experience-item">
              <div class="job-title">${escape(edu.degree)}</div>
              <div class="company">${escape(edu.institution)}</div>
              <div class="date">${escape(edu.startDate)} - ${escape(edu.endDate || 'Present')}</div>
              ${edu.description ? `<div class="description">${escape(edu.description)}</div>` : ''}
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
        <div class="hex-section">
          <h2 class="section-title">Skills</h2>
          <div class="skills-hex">
            ${r.skills
              .map(
                (s) => `
              <div class="skill-hex">${escape(s.name)}</div>
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

// 22. Diagonal Split
const diagonalSplit = (r: ManualResumeInput) => `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Source+Sans+Pro:wght@300;400;600&display=swap" rel="stylesheet">
<style>
  ${A4_STYLES}
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
  /* A4 sizing centralized via A4_STYLES */
  @media print {
    /* A4 html/body sizing provided by A4_STYLES */
    body {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .container {
      max-width: initial;
      width: auto;
      min-height: auto;
      box-shadow: none;
      margin: 0;
    }
    .section,
    .experience-item {
      break-inside: avoid;
      page-break-inside: avoid;
    }
    .diagonal-bg {
      background: #ddd !important;
    }
    .skill-tag {
      background: #666 !important;
      color: #fff !important;
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
      ${
        r.summary
          ? `
      <div class="section">
        <h2 class="section-title">Summary</h2>
        <div class="summary-box">
          ${escape(r.summary)}
        </div>
      </div>`
          : ''
      }
      
      <div class="section">
        <h2 class="section-title">Experience</h2>
        ${r.experience
          .map(
            (e) => `
          <div class="experience-item">
            <div class="job-title">${escape(e.jobTitle)}</div>
            <div class="company">${escape(e.company)}</div>
            <div class="date">${escape(e.startDate)} - ${escape(e.endDate || 'Present')}</div>
            ${
              e.description?.length
                ? `
              <div class="description">
                <ul>${e.description.map((d) => `<li>${escape(d)}</li>`).join('')}</ul>
              </div>
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
            <div class="job-title">${escape(edu.degree)}</div>
            <div class="company">${escape(edu.institution)}</div>
            <div class="date">${escape(edu.startDate)} - ${escape(edu.endDate || 'Present')}</div>
            ${edu.description ? `<div class="description">${escape(edu.description)}</div>` : ''}
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
        <div class="skills-diagonal">
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
    </div>
  </div>
</body>
</html>
`;

// 23. Circular Orbit

const circularOrbit = (r: ManualResumeInput) => `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; }
  body {
    font-family: 'Space Grotesk', sans-serif;
    margin: 0;
    padding: 20px;
    background: radial-gradient(circle at center, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
    color: #e94560;
    min-height: 100vh;
  }
  /* Ensure A4 size with safe margins when printing */
  @page { size: A4; margin: 15mm; }
  @media print {
    html, body { width: 210mm; height: 297mm; }
    body { margin: 0 !important; padding: 0 !important; background: white !important; color: black; }
    .container { max-width: unset !important; width: auto !important; margin: 0 !important; box-shadow: none !important; border-radius: 0 !important; background: white !important; }
    .header { background: #eee !important; color: #000 !important; }
    .contact-item { background: transparent !important; border: 1px solid #999 !important; color: #000 !important; }
    .orbit-bg { display: none !important; }
    .section, .experience-item { break-inside: avoid; page-break-inside: avoid; }
  }
  .container {
    max-width: 900px;
    margin: 0 auto;
    background: rgba(255,255,255,0.95);
    border-radius: 30px;
    overflow: hidden;
    position: relative;
    box-shadow: 0 30px 60px rgba(0,0,0,0.3);
  }
  .header {
    text-align: center;
    padding: 50px 40px;
    position: relative;
    z-index: 2;
    background: linear-gradient(135deg, #e94560, #f27121);
    color: white;
  }
  .name {
    font-size: 3rem;
    font-weight: 700;
    margin: 0;
    text-shadow: 0 4px 8px rgba(0,0,0,0.2);
  }
  .title {
    font-size: 1.4rem;
    font-weight: 300;
    margin-top: 10px;
    opacity: 0.9;
  }
  .contact-orbit {
    margin-top: 30px;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 20px;
  }
  .contact-item {
    background: rgba(255,255,255,0.2);
    padding: 12px 24px;
    border-radius: 50px;
    font-size: 0.95rem;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.1);
  }
  .content {
    padding: 70px 40px;
    position: relative;
    z-index: 1;
  }
  .orbit-bg {
    position: absolute;
    top: 200px;
    left: 50%;
    transform: translateX(-50%);
    width: 600px;
    height: 600px;
    border: 2px dashed rgba(233, 69, 96, 0.2);
    border-radius: 50%;
    z-index: 0;
    pointer-events: none;
  }
  .orbit-bg::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    height: 400px;
    border: 1px dashed rgba(233, 69, 96, 0.1);
    border-radius: 50%;
  }
  .orbit-bg::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 200px;
    height: 200px;
    border: 1px solid rgba(233, 69, 96, 0.3);
    border-radius: 50%;
  }
  .section {
    margin-bottom: 50px;
    position: relative;
    z-index: 1;
    background: rgba(255,255,255,0.95);
    padding: 20px;
    border-radius: 20px;
  }
  .section-title {
    font-size: 2rem;
    font-weight: 600;
    color: #e94560;
    margin: 0 0 30px;
    text-align: center;
    position: relative;
  }
  .section-title::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, #e94560, transparent);
    z-index: -1;
  }
  .section-title span {
    background: rgba(255,255,255,0.95);
    padding: 0 20px;
  }
  .summary-circle {
    background: #f8f9fa;
    padding: 30px;
    border-radius: 50%;
    width: 300px;
    height: 300px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    line-height: 1.4;
    box-shadow: 0 10px 30px rgba(233, 69, 96, 0.1);
    border: 3px solid rgba(233, 69, 96, 0.2);
    overflow-wrap: break-word;
    word-break: break-word;
    white-space: normal;
  }
  @media (max-width: 768px) {
    .orbit-bg {
      width: 300px;
      height: 300px;
      top: 150px;
    }
    .summary-circle {
      width: 250px;
      height: 250px;
      padding: 20px;
      font-size: 0.9rem;
    }
  }
</style>
</head>
<body>
  <div class="container">
    <header class="header">
      <h1 class="name">${escape(r.fullName)}</h1>
      ${r.title ? `<div class="title">${escape(r.title)}</div>` : ''}
      <div class="contact-orbit">
        <div class="contact-item">${escape(r.email)}</div>
        ${r.phone ? `<div class="contact-item">${escape(r.phone)}</div>` : ''}
        ${r.linkedIn ? `<div class="contact-item">${escape(r.linkedIn)}</div>` : ''}
        ${r.github ? `<div class="contact-item">${escape(r.github)}</div>` : ''}
        ${r.website ? `<div class="contact-item">${escape(r.website)}</div>` : ''}
      </div>
    </header>

    <div class="content">
      <div class="orbit-bg"></div>

      ${
        r.summary
          ? `
      <div class="section">
        <h2 class="section-title"><span>Summary</span></h2>
        <div class="summary-circle">
          <div>${escape(r.summary)}</div>
        </div>
      </div>`
          : ''
      }

      <div class="section">
        <h2 class="section-title"><span>Experience</span></h2>
        ${r.experience
          .map(
            (e) => `
          <div class="experience-item">
            <div class="job-title">${escape(e.jobTitle)}</div>
            <div class="company">${escape(e.company)}</div>
            <div class="date">${escape(e.startDate)} - ${escape(e.endDate || 'Present')}</div>
          </div>
        `
          )
          .join('')}
      </div>
    </div>
  </div>
</body>
</html>
`;

// 24. Vertical Ribbon
const verticalRibbon = (r: ManualResumeInput) => `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link href="https://fonts.googleapis.com/css2?family=Crimson+Text:wght@400;600;700&family=Lato:wght@300;400;700&display=swap" rel="stylesheet">
<style>
  ${A4_STYLES}
  * { box-sizing: border-box; }
  body {
    font-family: 'Lato', sans-serif;
    margin: 0;
    padding: 0;
    background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
  }
  /* Ensure A4 size with safe margins when printing */
  /* A4 sizing centralized via A4_STYLES */
  .container {
    max-width: 900px;
    margin: 0 auto;
    background: white;
    min-height: 100vh;
    position: relative;
    display: flex;
  }
  .ribbon {
    width: 120px;
    background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
    position: relative;
    flex-shrink: 0;
  }
  .ribbon::before {
    content: '';
    position: absolute;
    top: 0;
    right: -20px;
    width: 0;
    height: 0;
    border-left: 20px solid #764ba2;
    border-top: 20px solid transparent;
    border-bottom: 20px solid transparent;
  }
  .ribbon::after {
    content: '';
    position: absolute;
    bottom: 0;
    right: -20px;
    width: 0;
    height: 0;
    border-left: 20px solid #667eea;
    border-top: 20px solid transparent;
    border-bottom: 20px solid transparent;
  }
  .ribbon-content {
    padding: 40px 20px;
    color: white;
    text-align: center;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .ribbon-name {
    font-family: 'Crimson Text', serif;
    font-size: 1.8rem;
    font-weight: 700;
    writing-mode: vertical-rl;
    text-orientation: mixed;
    margin: 20px 0;
    letter-spacing: 2px;
  }
  .ribbon-contact {
    writing-mode: vertical-rl;
    text-orientation: mixed;
    font-size: 0.8rem;
    line-height: 1.8;
    opacity: 0.9;
  }
  .main-content {
    flex: 1;
    padding: 50px 60px 50px 40px;
    position: relative;
  }
  .title-banner {
    background: #f8f9fa;
    margin: -50px -60px 40px -40px;
    padding: 30px 60px 30px 40px;
    position: relative;
  }
  .title-banner::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    right: 0;
    height: 10px;
    background: linear-gradient(90deg, #667eea, #764ba2);
    clip-path: polygon(0 0, 100% 0, 95% 100%, 5% 100%);
  }
  .job-title {
    font-family: 'Crimson Text', serif;
    font-size: 2.2rem;
    font-weight: 600;
    color: #2c3e50;
    margin: 0;
  }
  .section {
    margin-bottom: 40px;
    position: relative;
  }
  .section-title {
    font-family: 'Crimson Text', serif;
    font-size: 1.6rem;
    font-weight: 700;
    color: #667eea;
    margin: 0 0 25px;
    position: relative;
    padding-left: 20px;
  }
  .section-title::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 30px;
    background: linear-gradient(180deg, #667eea, #764ba2);
  }
  .summary-ribbon {
    background: #f8f9fa;
    padding: 25px;
    border-radius: 10px;
    position: relative;
    line-height: 1.7;
    color: #34495e;
  }
  .summary-ribbon::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, #667eea, #764ba2);
    border-radius: 10px 10px 0 0;
  }
  .experience-item {
    margin-bottom: 30px;
    padding: 25px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.08);
    position: relative;
    border-left: 4px solid #667eea;
  }
  .experience-item::before {
    content: '';
    position: absolute;
    left: -8px;
    top: 20px;
    width: 12px;
    height: 12px;
    background: #667eea;
    border-radius: 50%;
    border: 3px solid white;
  }
  .job-role {
    font-family: 'Crimson Text', serif;
    font-size: 1.3rem;
    font-weight: 600;
    color: #2c3e50;
    margin: 0 0 5px;
  }
  .company {
    color: #667eea;
    font-weight: 700;
    font-size: 1.1rem;
    margin-bottom: 5px;
  }
  .date {
    color: #7f8c8d;
    font-size: 0.9rem;
    font-style: italic;
    margin-bottom: 15px;
  }
  .description {
    color: #34495e;
    line-height: 1.6;
  }
  .description ul {
    margin: 10px 0;
    padding-left: 20px;
  }
  .skills-ribbon {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 20px;
  }
  .skill-tag {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 500;
    position: relative;
    overflow: hidden;
  }
  .skill-tag::after {
    content: '';
    position: absolute;
    top: 0;
    right: -20px;
    width: 0;
    height: 0;
    border-left: 10px solid rgba(255,255,255,0.2);
    border-top: 15px solid transparent;
    border-bottom: 15px solid transparent;
  }
  @media (max-width: 768px) {
    .container {
      flex-direction: column;
    }
    .ribbon {
      width: 100%;
      height: auto;
    }
    .ribbon::before,
    .ribbon::after {
      display: none;
    }
    .ribbon-content {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
    }
    .ribbon-name {
      writing-mode: initial;
      text-orientation: initial;
      font-size: 1.5rem;
      margin: 0;
    }
    .ribbon-contact {
      writing-mode: initial;
      text-orientation: initial;
      text-align: right;
    }
    .main-content {
      padding: 30px 20px;
    }
    .title-banner {
      margin: -30px -20px 30px -20px;
      padding: 20px;
    }
    .job-title {
      font-size: 1.8rem;
    }
  }
  @media print {
    /* A4 html/body sizing provided by A4_STYLES */
    body { margin: 0 !important; background: white !important; }
    .container { max-width: unset !important; width: auto !important; margin: 0 !important; box-shadow: none !important; }
    .ribbon { width: 100px; }
    .ribbon::before, .ribbon::after { display: none !important; }
    .title-banner { margin: 0 !important; padding: 12mm 0 6mm 0 !important; }
    .section, .experience-item { break-inside: avoid; page-break-inside: avoid; }
    .skill-tag { background: #666 !important; }
  }
</style>
</head>
<body>
  <div class="container">
    <div class="ribbon">
      <div class="ribbon-content">
        <div class="ribbon-name">${escape(r.fullName)}</div>
        <div class="ribbon-contact">
          <div>${escape(r.email)}</div>
          ${r.phone ? `<div>${escape(r.phone)}</div>` : ''}
          ${r.linkedIn ? `<div>${escape(r.linkedIn)}</div>` : ''}
          ${r.github ? `<div>${escape(r.github)}</div>` : ''}
          ${r.website ? `<div>${escape(r.website)}</div>` : ''}
        </div>
      </div>
    </div>
    
    <div class="main-content">
      <div class="title-banner">
        ${r.title ? `<h1 class="job-title">${escape(r.title)}</h1>` : ''}
      </div>
      
      ${
        r.summary
          ? `
      <div class="section">
        <h2 class="section-title">Summary</h2>
        <div class="summary-ribbon">
          ${escape(r.summary)}
        </div>
      </div>`
          : ''
      }
      
      <div class="section">
        <h2 class="section-title">Experience</h2>
        ${r.experience
          .map(
            (e) => `
          <div class="experience-item">
            <div class="job-role">${escape(e.jobTitle)}</div>
            <div class="company">${escape(e.company)}</div>
            <div class="date">${escape(e.startDate)} - ${escape(e.endDate || 'Present')}</div>
            ${
              e.description?.length
                ? `
              <div class="description">
                <ul>${e.description.map((d) => `<li>${escape(d)}</li>`).join('')}</ul>
              </div>
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
            <div class="job-role">${escape(edu.degree)}</div>
            <div class="company">${escape(edu.institution)}</div>
            <div class="date">${escape(edu.startDate)} - ${escape(edu.endDate || 'Present')}</div>
            ${edu.description ? `<div class="description">${escape(edu.description)}</div>` : ''}
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
        <div class="skills-ribbon">
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
    </div>
  </div>
</body>
</html>
`;

// 25. Layered Paper
const layeredPaper = (r: ManualResumeInput) => `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&family=Open+Sans:wght@300;400;600&display=swap" rel="stylesheet">
<style>
  ${A4_STYLES}
  * { box-sizing: border-box; }
  body {
    font-family: 'Open Sans', sans-serif;
    margin: 0;
    padding: 40px 20px;
    background: #f5f5f5;
    min-height: 100vh;
  }
  /* Ensure A4 size with safe margins when printing */
  /* A4 sizing centralized via A4_STYLES */
  .container {
    max-width: 850px;
    margin: 0 auto;
    position: relative;
  }
  .paper-layer {
    background: white;
    margin-bottom: 20px;
    border-radius: 8px;
    position: relative;
    transform-origin: center;
  }
  .paper-layer:nth-child(1) {
    transform: rotate(-1deg);
    box-shadow: 0 8px 25px rgba(0,0,0,0.1);
    z-index: 1;
  }
  .paper-layer:nth-child(2) {
    transform: rotate(0.5deg);
    box-shadow: 0 12px 30px rgba(0,0,0,0.12);
    z-index: 2;
    margin-top: -15px;
  }
  .paper-layer:nth-child(3) {
    transform: rotate(-0.3deg);
    box-shadow: 0 16px 35px rgba(0,0,0,0.15);
    z-index: 3;
    margin-top: -15px;
  }
  .paper-layer:nth-child(4) {
    transform: rotate(0deg);
    box-shadow: 0 20px 40px rgba(0,0,0,0.18);
    z-index: 4;
    margin-top: -15px;
  }
  .paper-content {
    padding: 40px;
    position: relative;
  }
  .header-paper {
    text-align: center;
    border-bottom: 3px double #d4af37;
    padding-bottom: 30px;
    margin-bottom: 30px;
  }
  .name {
    font-family: 'Merriweather', serif;
    font-size: 2.8rem;
    font-weight: 700;
    color: #2c3e50;
    margin: 0;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
  }
  .title {
    font-size: 1.3rem;
    color: #d4af37;
    font-weight: 300;
    margin-top: 10px;
    font-style: italic;
  }
  .contact-paper {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 20px;
  }
  .contact-item {
    color: #7f8c8d;
    font-size: 0.95rem;
    position: relative;
  }
  .contact-item:not(:last-child)::after {
    content: '•';
    position: absolute;
    right: -12px;
    color: #d4af37;
  }
  .section-paper {
    margin-bottom: 35px;
  }
  .section-title {
    font-family: 'Merriweather', serif;
    font-size: 1.8rem;
    font-weight: 700;
    color: #2c3e50;
    margin: 0 0 25px;
    position: relative;
    text-align: center;
  }
  .section-title::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: #d4af37;
    z-index: -1;
  }
  .section-title span {
    background: white;
    padding: 0 20px;
  }
  .summary-paper {
    background: #fafafa;
    padding: 30px;
    border-radius: 8px;
    border-left: 4px solid #d4af37;
    line-height: 1.7;
    color: #34495e;
    font-style: italic;
    position: relative;
  }
  .summary-paper::before {
    content: '"';
    font-size: 4rem;
    color: #d4af37;
    position: absolute;
    top: -10px;
    left: 10px;
    font-family: 'Merriweather', serif;
    opacity: 0.3;
  }
  .experience-paper {
    margin-bottom: 30px;
    padding: 25px;
    background: #fdfdfd;
    border-radius: 8px;
    box-shadow: 0 3px 10px rgba(0,0,0,0.05);
    border-top: 2px solid #d4af37;
  }
  .job-title {
    font-family: 'Merriweather', serif;
    font-size: 1.4rem;
    font-weight: 700;
    color: #2c3e50;
    margin: 0 0 8px;
  }
  .company {
    color: #d4af37;
    font-weight: 600;
    font-size: 1.1rem;
    margin-bottom: 5px;
  }
  .date {
    color: #7f8c8d;
    font-size: 0.9rem;
    font-style: italic;
    margin-bottom: 15px;
  }
  .description {
    color: #34495e;
    line-height: 1.6;
  }
  .description ul {
    margin: 10px 0;
    padding-left: 25px;
  }
  .description li {
    margin-bottom: 5px;
  }
  .skills-paper {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 20px;
  }
  .skill-paper {
    background: #f8f9fa;
    color: #2c3e50;
    padding: 10px 18px;
    border-radius: 25px;
    font-size: 0.9rem;
    font-weight: 500;
    border: 2px solid #d4af37;
    position: relative;
    transition: all 0.3s ease;
  }
  .skill-paper:hover {
    background: #d4af37;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(212, 175, 55, 0.3);
  }
  @media (max-width: 768px) {
    body {
      padding: 20px 10px;
    }
    .paper-layer {
      transform: none !important;
      margin-top: 0 !important;
      margin-bottom: 10px;
    }
    .paper-content {
      padding: 25px 20px;
    }
    .name {
      font-size: 2.2rem;
    }
    .contact-paper {
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }
    .contact-item:not(:last-child)::after {
      display: none;
    }
  }
  @media print {
    /* A4 html/body sizing provided by A4_STYLES */
    body { background: white !important; color: black; padding: 0 !important; margin: 0 !important; }
    .container { max-width: unset !important; width: auto !important; margin: 0 !important; }
    .paper-layer { transform: none !important; box-shadow: none !important; margin: 0 0 12mm 0 !important; }
    .paper-content { padding: 0; }
    .section-paper, .experience-paper { break-inside: avoid; page-break-inside: avoid; }
    .skill-paper { background: #f0f0f0 !important; border-color: #666 !important; }
  }
</style>
</head>
<body>
  <div class="container">
    <div class="paper-layer">
      <div class="paper-content">
        <div class="header-paper">
          <h1 class="name">${escape(r.fullName)}</h1>
          ${r.title ? `<div class="title">${escape(r.title)}</div>` : ''}
          <div class="contact-paper">
            <div class="contact-item">${escape(r.email)}</div>
            ${r.phone ? `<div class="contact-item">${escape(r.phone)}</div>` : ''}
            ${r.linkedIn ? `<div class="contact-item">${escape(r.linkedIn)}</div>` : ''}
            ${r.github ? `<div class="contact-item">${escape(r.github)}</div>` : ''}
            ${r.website ? `<div class="contact-item">${escape(r.website)}</div>` : ''}
          </div>
        </div>
        
        ${
          r.summary
            ? `
        <div class="section-paper">
          <h2 class="section-title"><span>Summary</span></h2>
          <div class="summary-paper">
            ${escape(r.summary)}
          </div>
        </div>`
            : ''
        }
      </div>
    </div>
    
    <div class="paper-layer">
      <div class="paper-content">
        <div class="section-paper">
          <h2 class="section-title"><span>Experience</span></h2>
          ${r.experience
            .map(
              (e) => `
            <div class="experience-paper">
              <div class="job-title">${escape(e.jobTitle)}</div>
              <div class="company">${escape(e.company)}</div>
              <div class="date">${escape(e.startDate)} - ${escape(e.endDate || 'Present')}</div>
              ${
                e.description?.length
                  ? `
                <div class="description">
                  <ul>${e.description.map((d) => `<li>${escape(d)}</li>`).join('')}</ul>
                </div>
              `
                  : ''
              }
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    </div>
    
    ${
      r.education?.length
        ? `
    <div class="paper-layer">
      <div class="paper-content">
        <div class="section-paper">
          <h2 class="section-title"><span>Education</span></h2>
          ${r.education
            .map(
              (edu) => `
            <div class="experience-paper">
              <div class="job-title">${escape(edu.degree)}</div>
              <div class="company">${escape(edu.institution)}</div>
              <div class="date">${escape(edu.startDate)} - ${escape(edu.endDate || 'Present')}</div>
              ${edu.description ? `<div class="description">${escape(edu.description)}</div>` : ''}
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    </div>`
        : ''
    }
    
    ${
      r.skills?.length
        ? `
    <div class="paper-layer">
      <div class="paper-content">
        <div class="section-paper">
          <h2 class="section-title"><span>Skills</span></h2>
          <div class="skills-paper">
            ${r.skills
              .map(
                (s) => `
              <div class="skill-paper">${escape(s.name)}</div>
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
</html>
`;

// 26. Art Deco Revival
const artDecoRevival = (r: ManualResumeInput) => `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link href="https://fonts.googleapis.com/css2?family=Poiret+One&family=Raleway:wght@300;400;600;700&display=swap" rel="stylesheet">
<style>
  ${A4_STYLES}
  * { box-sizing: border-box; }
  body {
    font-family: 'Raleway', sans-serif;
    margin: 0;
    padding: 20px;
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    color: #f4f4f4;
    min-height: 100vh;
  }
  /* Ensure A4 size with safe margins when printing */
  /* A4 sizing centralized via A4_STYLES */
  .container {
    max-width: 900px;
    margin: 0 auto;
    background: #0f0f0f;
    border: 3px solid #d4af37;
    position: relative;
    overflow: hidden;
  }
  .art-deco-border {
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 10px;
    border: 1px solid #d4af37;
    pointer-events: none;
  }
  .art-deco-corner {
    position: absolute;
    width: 40px;
    height: 40px;
    border: 2px solid #d4af37;
  }
  .art-deco-corner.top-left {
    top: -2px;
    left: -2px;
    border-right: none;
    border-bottom: none;
  }
  .art-deco-corner.top-right {
    top: -2px;
    right: -2px;
    border-left: none;
    border-bottom: none;
  }
  .art-deco-corner.bottom-left {
    bottom: -2px;
    left: -2px;
    border-right: none;
    border-top: none;
  }
  .art-deco-corner.bottom-right {
    bottom: -2px;
    right: -2px;
    border-left: none;
    border-top: none;
  }
  .header {
    background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
    color: #0f0f0f;
    padding: 50px 40px;
    text-align: center;
    position: relative;
  }
  .header::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 200px;
    height: 4px;
    background: repeating-linear-gradient(90deg, #0f0f0f 0px, #0f0f0f 10px, transparent 10px, transparent 20px);
  }
  .header::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 200px;
    height: 4px;
    background: repeating-linear-gradient(90deg, #0f0f0f 0px, #0f0f0f 10px, transparent 10px, transparent 20px);
  }
  .name {
    font-family: 'Poiret One', cursive;
    font-size: 3.5rem;
    font-weight: 400;
    margin: 0;
    letter-spacing: 3px;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  }
  .title {
    font-size: 1.4rem;
    font-weight: 300;
    margin-top: 15px;
    letter-spacing: 2px;
    text-transform: uppercase;
  }
  .contact-deco {
    margin-top: 25px;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 30px;
  }
  .contact-item {
    font-size: 0.95rem;
    font-weight: 400;
    position: relative;
  }
  .contact-item::before {
    content: '◆';
    margin-right: 8px;
    color: #0f0f0f;
  }
  .content {
    padding: 50px 40px;
    position: relative;
  }
  .section {
    margin-bottom: 50px;
    position: relative;
  }
  .section-title {
    font-family: 'Poiret One', cursive;
    font-size: 2.2rem;
    color: #d4af37;
    margin: 0 0 30px;
    text-align: center;
    position: relative;
    letter-spacing: 2px;
  }
  .section-title::before,
  .section-title::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 100px;
    height: 2px;
    background: linear-gradient(90deg, transparent, #d4af37, transparent);
  }
  .section-title::before {
    left: -120px;
  }
  .section-title::after {
    right: -120px;
  }
  .summary-deco {
    background: rgba(212, 175, 55, 0.1);
    padding: 30px;
    border: 1px solid #d4af37;
    position: relative;
    line-height: 1.8;
    text-align: center;
    font-style: italic;
  }
  .summary-deco::before,
  .summary-deco::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    border: 2px solid #d4af37;
    background: #0f0f0f;
  }
  .summary-deco::before {
    top: -10px;
    left: -10px;
  }
  .summary-deco::after {
    bottom: -10px;
    right: -10px;
  }
  .experience-deco {
    margin-bottom: 35px;
    padding: 30px;
    background: rgba(244, 244, 244, 0.05);
    border-left: 4px solid #d4af37;
    position: relative;
  }
  .experience-deco::before {
    content: '';
    position: absolute;
    left: -8px;
    top: 25px;
    width: 12px;
    height: 12px;
    background: #d4af37;
    transform: rotate(45deg);
  }
  .job-title {
    font-family: 'Poiret One', cursive;
    font-size: 1.6rem;
    color: #d4af37;
    margin: 0 0 10px;
    letter-spacing: 1px;
  }
  .company {
    color: #f4f4f4;
    font-weight: 600;
    font-size: 1.2rem;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  .date {
    color: #bbb;
    font-size: 0.9rem;
    font-style: italic;
    margin-bottom: 15px;
  }
  .description {
    color: #ddd;
    line-height: 1.6;
  }
  .description ul {
    margin: 10px 0;
    padding-left: 25px;
  }
  .skills-deco {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    margin-top: 25px;
    justify-content: center;
  }
  .skill-deco {
    background: transparent;
    color: #d4af37;
    padding: 12px 20px;
    border: 2px solid #d4af37;
    font-size: 0.9rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    position: relative;
    transition: all 0.3s ease;
  }
  .skill-deco::before {
    content: '';
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    border: 1px solid #d4af37;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  .skill-deco:hover {
    background: #d4af37;
    color: #0f0f0f;
  }
  .skill-deco:hover::before {
    opacity: 1;
  }
  @media (max-width: 768px) {
    .container {
      margin: 10px;
    }
    .header {
      padding: 40px 20px;
    }
    .name {
      font-size: 2.5rem;
      letter-spacing: 2px;
    }
    .content {
      padding: 40px 20px;
    }
    .section-title::before,
    .section-title::after {
      display: none;
    }
    .art-deco-corner {
      width: 25px;
      height: 25px;
    }
  }
  @media print {
    /* A4 html/body sizing provided by A4_STYLES */
    body { background: white !important; color: black; margin: 0 !important; }
    .container { background: white !important; border-color: #666; max-width: unset !important; width: auto !important; margin: 0 !important; }
    .header { background: #f0f0f0 !important; color: black; }
    .section, .experience-deco { break-inside: avoid; page-break-inside: avoid; }
    .section-title, .job-title, .skill-deco { color: #666 !important; }
    .art-deco-border, .art-deco-corner { border-color: #666; }
  }
</style>
</head>
<body>
  <div class="container">
    <div class="art-deco-border"></div>
    <div class="art-deco-corner top-left"></div>
    <div class="art-deco-corner top-right"></div>
    <div class="art-deco-corner bottom-left"></div>
    <div class="art-deco-corner bottom-right"></div>
    
    <header class="header">
      <h1 class="name">${escape(r.fullName)}</h1>
      ${r.title ? `<div class="title">${escape(r.title)}</div>` : ''}
      <div class="contact-deco">
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
        <h2 class="section-title">Summary</h2>
        <div class="summary-deco">
          ${escape(r.summary)}
        </div>
      </div>`
          : ''
      }
      
      <div class="section">
        <h2 class="section-title">Experience</h2>
        ${r.experience
          .map(
            (e) => `
          <div class="experience-deco">
            <div class="job-title">${escape(e.jobTitle)}</div>
            <div class="company">${escape(e.company)}</div>
            <div class="date">${escape(e.startDate)} - ${escape(e.endDate || 'Present')}</div>
            ${
              e.description?.length
                ? `
              <div class="description">
                <ul>${e.description.map((d) => `<li>${escape(d)}</li>`).join('')}</ul>
              </div>
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
          <div class="experience-deco">
            <div class="job-title">${escape(edu.degree)}</div>
            <div class="company">${escape(edu.institution)}</div>
            <div class="date">${escape(edu.startDate)} - ${escape(edu.endDate || 'Present')}</div>
            ${edu.description ? `<div class="description">${escape(edu.description)}</div>` : ''}
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
        <div class="skills-deco">
          ${r.skills
            .map(
              (s) => `
            <div class="skill-deco">${escape(s.name)}</div>
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
</html>
`;

// 27. Neon Cyber Grid
const neonCyberGrid = (r: ManualResumeInput) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${escape(r.fullName)} - Resume</title>
<style>
  ${A4_STYLES}
  /* A4 sizing centralized via A4_STYLES */
  
  :root {
    --neon-blue: #0ff0fc;
    --neon-pink: #ff2ced;
    --neon-purple: #9d4dff;
    --dark-bg: #0a0a14;
    --grid-color: rgba(255,255,255,0.05);
  }
  
  body {
    /* Removed explicit A4 width/height; handled by A4_STYLES in print */
    margin: 0;
    padding: 0;
    font-family: 'Oxanium', sans-serif;
    background-color: var(--dark-bg);
    color: white;
    position: relative;
    overflow: hidden;
  }
  
  body::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      linear-gradient(var(--grid-color) 1px, transparent 1px),
      linear-gradient(90deg, var(--grid-color) 1px, transparent 1px);
    background-size: 20px 20px;
    z-index: -1;
  }
  
  .container {
    width: 170mm;
    height: 267mm;
    margin: 0 auto;
    position: relative;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12mm;
    padding-bottom: 5mm;
    border-bottom: 1px solid var(--neon-blue);
  }
  
  .name-title h1 {
    font-family: 'Rajdhani', sans-serif;
    font-size: 24pt;
    margin: 0;
    background: linear-gradient(90deg, var(--neon-blue), var(--neon-pink));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  
  .name-title h2 {
    font-family: 'Oxanium', sans-serif;
    font-weight: 300;
    margin: 2mm 0 0;
    color: var(--neon-blue);
    font-size: 12pt;
  }
  
  .contact-info {
    text-align: right;
    font-size: 9pt;
  }
  
  .contact-item {
    margin-bottom: 2mm;
  }
  
  .contact-item a {
    color: white;
    text-decoration: none;
  }
  
  .main-grid {
    display: grid;
    grid-template-columns: 85mm 85mm;
    gap: 8mm;
  }
  
  .section {
    position: relative;
    padding: 5mm;
    background: rgba(10, 10, 20, 0.7);
    border: 1px solid rgba(255,255,255,0.1);
    break-inside: avoid;
  }
  
  .section-title {
    font-family: 'Rajdhani', sans-serif;
    font-size: 14pt;
    margin: -5mm -5mm 5mm;
    padding: 2mm 5mm;
    background: linear-gradient(90deg, transparent 0%, rgba(15, 240, 252, 0.1) 100%);
    border-left: 2px solid var(--neon-blue);
    color: var(--neon-blue);
    text-transform: uppercase;
  }
  
  .experience-item {
    margin-bottom: 5mm;
    padding-bottom: 5mm;
    border-bottom: 1px dashed rgba(255,255,255,0.1);
    font-size: 9pt;
  }
  
  .experience-item:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
  
  .job-title {
    font-size: 10pt;
    margin: 0 0 1mm;
    color: var(--neon-pink);
    font-weight: bold;
  }
  
  .company {
    font-weight: 600;
    margin-bottom: 1mm;
  }
  
  .date {
    font-size: 8pt;
    color: #aaa;
    margin-bottom: 2mm;
    font-style: italic;
  }
  
  .description {
    line-height: 1.4;
  }
  
  .description ul {
    padding-left: 5mm;
    margin: 2mm 0;
  }
  
  .description li {
    margin-bottom: 1mm;
    position: relative;
  }
  
  .description li::before {
    content: '▹';
    position: absolute;
    left: -4mm;
    color: var(--neon-blue);
  }
  
  .skills-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 3mm;
    font-size: 8pt;
  }
  
  .skill-item {
    background: rgba(15, 240, 252, 0.1);
    border: 1px solid rgba(15, 240, 252, 0.3);
    padding: 2mm;
    text-align: center;
    border-radius: 1mm;
  }
  
  .hexagon {
    position: absolute;
    width: 20mm;
    height: 11.55mm;
    background-color: rgba(255, 44, 237, 0.1);
    border-left: 1px solid var(--neon-pink);
    border-right: 1px solid var(--neon-pink);
  }
  
  .hexagon::before,
  .hexagon::after {
    content: "";
    position: absolute;
    width: 0;
    border-left: 10mm solid transparent;
    border-right: 10mm solid transparent;
  }
  
  .hexagon::before {
    bottom: 100%;
    border-bottom: 5.77mm solid rgba(255, 44, 237, 0.1);
  }
  
  .hexagon::after {
    top: 100%;
    border-top: 5.77mm solid rgba(255, 44, 237, 0.1);
  }
  
  .hex1 {
    top: 20mm;
    left: -10mm;
  }
  
  .hex2 {
    bottom: 20mm;
    right: -10mm;
  }
</style>
</head>
<body>
  <div class="container">
    <div class="hexagon hex1"></div>
    <div class="hexagon hex2"></div>
    
    <div class="header">
      <div class="name-title">
        <h1>${escape(r.fullName)}</h1>
        ${r.title ? `<h2>${escape(r.title)}</h2>` : ''}
      </div>
      
      <div class="contact-info">
        ${r.email ? `<div class="contact-item">${escape(r.email)}</div>` : ''}
        ${r.phone ? `<div class="contact-item">${escape(r.phone)}</div>` : ''}
        ${r.linkedIn ? `<div class="contact-item">${escape(r.linkedIn.split('/').pop() || r.linkedIn)}</div>` : ''}
        ${r.github ? `<div class="contact-item">${escape(r.github.split('/').pop() || r.github)}</div>` : ''}
        ${r.website ? `<div class="contact-item">${escape(r.website.replace(/^https?:\/\//, ''))}</div>` : ''}
      </div>
    </div>
    
    <div class="main-grid">
      <div class="left-col">
        ${
          r.summary
            ? `
        <div class="section">
          <h2 class="section-title">Profile</h2>
          <div class="description">
            ${escape(r.summary)}
          </div>
        </div>`
            : ''
        }
        
        <div class="section">
          <h2 class="section-title">Experience</h2>
          ${r.experience
            .slice(0, 3) // Limit to 3 for A4 space
            .map(
              (e) => `
            <div class="experience-item">
              <div class="job-title">${escape(e.jobTitle)}</div>
              <div class="company">${escape(e.company)}</div>
              <div class="date">${escape(e.startDate)} — ${escape(e.endDate || 'Present')}</div>
              ${
                e.description?.length
                  ? `
                <div class="description">
                  <ul>${e.description
                    .slice(0, 4)
                    .map((d) => `<li>${escape(d)}</li>`)
                    .join('')}</ul>
                </div>
              `
                  : ''
              }
            </div>
          `
            )
            .join('')}
        </div>
      </div>
      
      <div class="right-col">
        ${
          r.skills?.length
            ? `
        <div class="section">
          <h2 class="section-title">Skills</h2>
          <div class="skills-grid">
            ${r.skills
              .slice(0, 12) // Limit to 12 for A4 space
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
        
        ${
          r.education?.length
            ? `
        <div class="section">
          <h2 class="section-title">Education</h2>
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
    </div>
  </div>
</body>
</html>
`;

// 28. Organic Watercolor
const organicWatercolor = (r: ManualResumeInput) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${escape(r.fullName)} - Resume</title>
<style>
  ${A4_STYLES}
  /* A4 sizing centralized via A4_STYLES */
  
  :root {
    --watercolor-blue: #a8d8ea;
    --watercolor-pink: #f8c3cd;
    --watercolor-purple: #c4b2d6;
    --accent-color: #e36387;
  }
  
  body {
    /* Removed explicit A4 width/height; handled by A4_STYLES in print */
    margin: 0;
    padding: 0;
    font-family: 'Georgia', serif;
    background: linear-gradient(135deg, var(--watercolor-blue), var(--watercolor-purple));
    color: #333;
    position: relative;
    overflow: hidden;
  }
  
  .watercolor-stain {
    position: absolute;
    opacity: 0.3;
    z-index: -1;
  }
  .stain1 { top: -50mm; right: -50mm; width: 200mm; height: 200mm; background: var(--watercolor-pink); border-radius: 50%; }
  .stain2 { bottom: -30mm; left: -30mm; width: 150mm; height: 150mm; background: var(--watercolor-purple); border-radius: 30% 70% 70% 30%; }
  
  .container {
    width: 180mm;
    height: 277mm;
    margin: 10mm auto;
    background: rgba(255,255,255,0.85);
    box-shadow: 0 0 20mm rgba(0,0,0,0.1);
    padding: 15mm;
    position: relative;
  }
  
  .header {
    display: flex;
    margin-bottom: 8mm;
    border-bottom: 2px solid var(--accent-color);
    padding-bottom: 5mm;
  }
  
  .name-title {
    flex: 1;
  }
  
  h1 {
    font-size: 22pt;
    margin: 0;
    color: var(--accent-color);
    font-weight: normal;
    letter-spacing: 1px;
  }
  
  h2 {
    font-size: 12pt;
    margin: 2mm 0 0;
    color: #666;
    font-weight: normal;
    font-style: italic;
  }
  
  .contact-info {
    text-align: right;
    font-size: 9pt;
  }
  
  .main-content {
    display: grid;
    grid-template-columns: 60mm 90mm;
    gap: 15mm;
  }
  
  .section {
    margin-bottom: 8mm;
  }
  
  .section-title {
    font-size: 14pt;
    color: var(--accent-color);
    border-bottom: 1px dashed var(--accent-color);
    padding-bottom: 2mm;
    margin-bottom: 5mm;
    font-variant: small-caps;
  }
  
  .experience-item {
    margin-bottom: 5mm;
  }
  
  .job-title {
    font-weight: bold;
    font-size: 10pt;
  }
  
  .company {
    font-style: italic;
    font-size: 9pt;
    color: #666;
  }
  
  .date {
    font-size: 8pt;
    color: #999;
  }
  
  .description {
    font-size: 9pt;
    line-height: 1.5;
    margin-top: 2mm;
  }
  
  .skills-list {
    columns: 2;
    column-gap: 5mm;
    font-size: 9pt;
  }
  
  .skill-item {
    margin-bottom: 2mm;
    position: relative;
    padding-left: 4mm;
  }
  
  .skill-item:before {
    content: "•";
    color: var(--accent-color);
    position: absolute;
    left: 0;
  }
</style>
</head>
<body>
  <div class="watercolor-stain stain1"></div>
  <div class="watercolor-stain stain2"></div>
  
  <div class="container">
    <div class="header">
      <div class="name-title">
        <h1>${escape(r.fullName)}</h1>
        ${r.title ? `<h2>${escape(r.title)}</h2>` : ''}
      </div>
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
        
        <div class="section">
          <h3 class="section-title">Skills</h3>
          <div class="skills-list">
            ${r.skills?.map((s) => `<div class="skill-item">${escape(s.name)}</div>`).join('') || ''}
          </div>
        </div>
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
              <div class="description">${
                e.description
                  ?.slice(0, 3)
                  .map((d) => escape(d))
                  .join('<br>') || ''
              }</div>
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

// 29. Isometric 3D City
const isometric3DCity = (r: ManualResumeInput) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${escape(r.fullName)} - Resume</title>
<style>
  ${A4_STYLES}
  /* A4 sizing centralized via A4_STYLES */
  
  :root {
    --building-1: #5e81ac;
    --building-2: #81a1c1;
    --building-3: #88c0d0;
    --road: #4c566a;
    --accent: #bf616a;
  }
  
  body {
    /* Removed explicit A4 width/height; handled by A4_STYLES in print */
    margin: 0;
    padding: 0;
    font-family: 'Arial', sans-serif;
    background: #eceff4;
    position: relative;
    overflow: hidden;
  }
  
  .cityscape {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 40mm;
    background: var(--road);
  }
  
  .building {
    position: absolute;
    bottom: 40mm;
    background: linear-gradient(to bottom, var(--building-1), var(--building-2));
    transform: skewX(-30deg) scaleY(0.866) translateX(10mm);
  }
  
  .building:before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(to right, rgba(0,0,0,0.1), transparent);
  }
  
  .building-1 { left: 20mm; width: 30mm; height: 80mm; }
  .building-2 { left: 60mm; width: 25mm; height: 60mm; background: linear-gradient(to bottom, var(--building-2), var(--building-3)); }
  .building-3 { left: 100mm; width: 35mm; height: 100mm; }
  
  .container {
    width: 180mm;
    height: 277mm;
    margin: 10mm auto;
    position: relative;
    z-index: 1;
  }
  
  .header {
    background: white;
    padding: 8mm;
    box-shadow: 0 2mm 5mm rgba(0,0,0,0.1);
    margin-bottom: 8mm;
  }
  
  h1 {
    font-size: 24pt;
    margin: 0;
    color: var(--accent);
  }
  
  h2 {
    font-size: 12pt;
    margin: 2mm 0 0;
    color: #4c566a;
  }
  
  .content-grid {
    display: grid;
    grid-template-columns: 60mm 110mm;
    gap: 10mm;
  }
  
  .section {
    background: white;
    padding: 5mm;
    box-shadow: 0 2mm 5mm rgba(0,0,0,0.1);
    margin-bottom: 8mm;
  }
  
  .section-title {
    font-size: 14pt;
    color: var(--accent);
    border-left: 3mm solid var(--accent);
    padding-left: 3mm;
    margin: 0 0 5mm;
  }
  
  .experience-item {
    margin-bottom: 5mm;
  }
  
  .job-title {
    font-weight: bold;
    font-size: 10pt;
  }
  
  .company {
    font-size: 9pt;
    color: #4c566a;
  }
  
  .date {
    font-size: 8pt;
    color: #81a1c1;
    margin-bottom: 2mm;
  }
  
  .description {
    font-size: 9pt;
    line-height: 1.5;
  }
  
  .skills-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 3mm;
  }
  
  .skill-item {
    background: #e5e9f0;
    padding: 2mm;
    font-size: 8pt;
    text-align: center;
  }
</style>
</head>
<body>
  <div class="cityscape">
    <div class="building building-1"></div>
    <div class="building building-2"></div>
    <div class="building building-3"></div>
  </div>
  
  <div class="container">
    <div class="header">
      <h1>${escape(r.fullName)}</h1>
      ${r.title ? `<h2>${escape(r.title)}</h2>` : ''}
    </div>
    
    <div class="content-grid">
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
        
        <div class="section">
          <h3 class="section-title">Contact</h3>
          <div class="description">
            ${r.email ? `<div><strong>Email:</strong> ${escape(r.email)}</div>` : ''}
            ${r.phone ? `<div><strong>Phone:</strong> ${escape(r.phone)}</div>` : ''}
            ${r.linkedIn ? `<div><strong>LinkedIn:</strong> ${escape(r.linkedIn)}</div>` : ''}
          </div>
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
  </div>
</body>
</html>
`;

// 30. Space Explorer
const spaceExplorer = (r: ManualResumeInput) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${escape(r.fullName)} - Resume</title>
<style>
  ${A4_STYLES}
  /* A4 sizing centralized via A4_STYLES */
  
  :root {
    --space-dark: #0b0e23;
    --space-blue: #1a237e;
    --space-purple: #4a148c;
    --planet: #ffab00;
    --accent: #00b0ff;
  }
  
  body {
    /* Removed explicit A4 width/height; handled by A4_STYLES in print */
    margin: 0;
    padding: 0;
    font-family: 'Segoe UI', sans-serif;
    background: linear-gradient(to bottom, var(--space-dark), var(--space-blue));
    color: white;
    position: relative;
    overflow: hidden;
  }
  
  .planet {
    position: absolute;
    top: -50mm;
    right: -50mm;
    width: 200mm;
    height: 200mm;
    background: var(--planet);
    border-radius: 50%;
    opacity: 0.1;
  }
  
  .stars {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(1px 1px at 20mm 30mm, white 1%, transparent 1%),
      radial-gradient(1px 1px at 50mm 80mm, white 1%, transparent 1%),
      radial-gradient(1px 1px at 80mm 20mm, white 1%, transparent 1%),
      radial-gradient(1px 1px at 120mm 60mm, white 1%, transparent 1%),
      radial-gradient(1px 1px at 160mm 30mm, white 1%, transparent 1%),
      radial-gradient(1px 1px at 190mm 90mm, white 1%, transparent 1%);
  }
  
  .container {
    width: 180mm;
    height: 277mm;
    margin: 10mm auto;
    position: relative;
    z-index: 1;
  }
  
  .header {
    border-bottom: 1px solid var(--accent);
    padding-bottom: 5mm;
    margin-bottom: 10mm;
  }
  
  h1 {
    font-size: 28pt;
    margin: 0;
    color: var(--accent);
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  
  h2 {
    font-size: 14pt;
    margin: 2mm 0 0;
    color: rgba(255,255,255,0.7);
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
    content: "🛰";
    margin-right: 2mm;
    color: var(--accent);
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
    color: var(--accent);
    margin: 0 0 5mm;
    position: relative;
    padding-left: 8mm;
  }
  
  .section-title:before {
    content: "✦";
    position: absolute;
    left: 0;
    color: var(--planet);
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
    color: var(--accent);
    margin-bottom: 1mm;
  }
  
  .date {
    font-size: 9pt;
    color: rgba(255,255,255,0.6);
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
    content: "◈";
    position: absolute;
    left: 0;
    color: var(--planet);
    font-size: 8pt;
  }
  
  .skills-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 3mm;
  }
  
  .skill-item {
    background: rgba(0, 176, 255, 0.1);
    border: 1px solid var(--accent);
    padding: 2mm;
    font-size: 8pt;
    text-align: center;
    border-radius: 2mm;
  }
</style>
</head>
<body>
  <div class="planet"></div>
  <div class="stars"></div>
  
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
          <h3 class="section-title">Mission Profile</h3>
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
          <h3 class="section-title">Technical Systems</h3>
          <div class="skills-grid">
            ${r.skills.map((s) => `<div class="skill-item">${escape(s.name)}</div>`).join('')}
          </div>
        </div>`
            : ''
        }
      </div>
      
      <div class="right-col">
        <div class="section">
          <h3 class="section-title">Mission Log</h3>
          ${r.experience
            .slice(0, 3)
            .map(
              (e) => `
            <div class="experience-item">
              <div class="job-title">${escape(e.jobTitle)}</div>
              <div class="company">${escape(e.company)}</div>
              <div class="date">${escape(e.startDate)} — ${escape(e.endDate || 'Ongoing')}</div>
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
          <h3 class="section-title">Training</h3>
          ${r.education
            .map(
              (edu) => `
            <div class="experience-item">
              <div class="job-title">${escape(edu.degree)}</div>
              <div class="company">${escape(edu.institution)}</div>
              <div class="date">${escape(edu.startDate)} — ${escape(edu.endDate || 'In Progress')}</div>
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
  circularOrbit,
  verticalRibbon,
  diagonalSplit,
  hexagonalGrid,
  layeredPaper,
  artDecoRevival,
  neonCyberGrid,
  organicWatercolor,
  isometric3DCity,
  spaceExplorer,
};
