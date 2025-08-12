import { Resume } from '../types/resume';

const escape = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

// 25. Layered Paper
export const layeredPaper = (r: Resume) => `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&family=Open+Sans:wght@300;400;600&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; }
  body {
    font-family: 'Open Sans', sans-serif;
    margin: 0;
    padding: 40px 20px;
    background: #f5f5f5;
    min-height: 100vh;
  }
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
    body {
      background: white;
      padding: 0;
    }
    .paper-layer {
      transform: none !important;
      box-shadow: none !important;
      margin: 0 0 20px 0 !important;
    }
    .skill-paper {
      background: #f0f0f0 !important;
      border-color: #666 !important;
    }
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
        
        ${r.summary ? `
        <div class="section-paper">
          <h2 class="section-title"><span>Summary</span></h2>
          <div class="summary-paper">
            ${escape(r.summary)}
          </div>
        </div>` : ''}
      </div>
    </div>
    
    <div class="paper-layer">
      <div class="paper-content">
        <div class="section-paper">
          <h2 class="section-title"><span>Experience</span></h2>
          ${r.experience.map(e => `
            <div class="experience-paper">
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
      </div>
    </div>
    
    ${r.education?.length ? `
    <div class="paper-layer">
      <div class="paper-content">
        <div class="section-paper">
          <h2 class="section-title"><span>Education</span></h2>
          ${r.education.map(edu => `
            <div class="experience-paper">
              <div class="job-title">${escape(edu.degree)}</div>
              <div class="company">${escape(edu.institution)}</div>
              <div class="date">${escape(edu.startDate)} - ${escape(edu.endDate || 'Present')}</div>
              ${edu.description ? `<div class="description">${escape(edu.description)}</div>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    </div>` : ''}
    
    ${r.skills?.length ? `
    <div class="paper-layer">
      <div class="paper-content">
        <div class="section-paper">
          <h2 class="section-title"><span>Skills</span></h2>
          <div class="skills-paper">
            ${r.skills.map(s => `
              <div class="skill-paper">${escape(s.name)}</div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>` : ''}
  </div>
</body>
</html>
`;

// 26. Art Deco Revival
export const artDecoRevival = (r: Resume) => `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link href="https://fonts.googleapis.com/css2?family=Poiret+One&family=Raleway:wght@300;400;600;700&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; }
  body {
    font-family: 'Raleway', sans-serif;
    margin: 0;
    padding: 20px;
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    color: #f4f4f4;
    min-height: 100vh;
  }
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
    body {
      background: white;
      color: black;
    }
    .container {
      background: white;
      border-color: #666;
    }
    .header {
      background: #f0f0f0 !important;
      color: black;
    }
    .section-title,
    .job-title,
    .skill-deco {
      color: #666 !important;
    }
    .art-deco-border,
    .art-deco-corner {
      border-color: #666;
    }
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
      ${r.summary ? `
      <div class="section">
        <h2 class="section-title">Summary</h2>
        <div class="summary-deco">
          ${escape(r.summary)}
        </div>
      </div>` : ''}
      
      <div class="section">
        <h2 class="section-title">Experience</h2>
        ${r.experience.map(e => `
          <div class="experience-deco">
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
          <div class="experience-deco">
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
        <div class="skills-deco">
          ${r.skills.map(s => `
            <div class="skill-deco">${escape(s.name)}</div>
          `).join('')}
        </div>
      </div>` : ''}
    </div>
  </div>
</body>
</html>
`;
