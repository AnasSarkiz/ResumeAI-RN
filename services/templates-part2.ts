import { Resume } from '../types/resume';

const escape = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

// 23. Circular Orbit

export const circularOrbit = (r: Resume) => `
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

      ${r.summary ? `
      <div class="section">
        <h2 class="section-title"><span>Summary</span></h2>
        <div class="summary-circle">
          <div>${escape(r.summary)}</div>
        </div>
      </div>` : ''}

      <div class="section">
        <h2 class="section-title"><span>Experience</span></h2>
        ${r.experience.map(e => `
          <div class="experience-item">
            <div class="job-title">${escape(e.jobTitle)}</div>
            <div class="company">${escape(e.company)}</div>
            <div class="date">${escape(e.startDate)} - ${escape(e.endDate || 'Present')}</div>
          </div>
        `).join('')}
      </div>
    </div>
  </div>
</body>
</html>
`;






// 24. Vertical Ribbon
export const verticalRibbon = (r: Resume) => `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link href="https://fonts.googleapis.com/css2?family=Crimson+Text:wght@400;600;700&family=Lato:wght@300;400;700&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; }
  body {
    font-family: 'Lato', sans-serif;
    margin: 0;
    padding: 0;
    background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
  }
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
    body {
      background: white;
    }
    .container {
      box-shadow: none;
    }
    .skill-tag {
      background: #666 !important;
    }
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
      
      ${r.summary ? `
      <div class="section">
        <h2 class="section-title">Summary</h2>
        <div class="summary-ribbon">
          ${escape(r.summary)}
        </div>
      </div>` : ''}
      
      <div class="section">
        <h2 class="section-title">Experience</h2>
        ${r.experience.map(e => `
          <div class="experience-item">
            <div class="job-role">${escape(e.jobTitle)}</div>
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
            <div class="job-role">${escape(edu.degree)}</div>
            <div class="company">${escape(edu.institution)}</div>
            <div class="date">${escape(edu.startDate)} - ${escape(edu.endDate || 'Present')}</div>
            ${edu.description ? `<div class="description">${escape(edu.description)}</div>` : ''}
          </div>
        `).join('')}
      </div>` : ''}
      
      ${r.skills?.length ? `
      <div class="section">
        <h2 class="section-title">Skills</h2>
        <div class="skills-ribbon">
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
