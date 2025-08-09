import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { Resume } from '../types/resume';

export const exportResumeToPDF = async (resume: Resume): Promise<string> => {
  try {
    const html = `
      <html>
        <head>
          <style>
            body { font-family: Arial; padding: 20px; max-width: 800px; margin: 0 auto; }
            h1 { color: #333; margin-bottom: 5px; }
            .contact-info { margin-bottom: 20px; font-size: 14px; color: #555; }
            .section { margin-bottom: 20px; }
            .section-title { border-bottom: 2px solid #333; padding-bottom: 5px; margin-bottom: 10px; }
            .job, .education { margin-bottom: 15px; }
            .job-title { font-weight: bold; }
            .company, .institution { font-style: italic; }
            .date { color: #555; font-size: 14px; }
            ul { margin-top: 5px; padding-left: 20px; }
            li { margin-bottom: 3px; }
            .skills { display: flex; flex-wrap: wrap; gap: 10px; }
            .skill { background: #f0f0f0; padding: 5px 10px; border-radius: 3px; }
          </style>
        </head>
        <body>
          <h1>${resume.fullName}</h1>
          <div class="contact-info">
            ${resume.email} | ${resume.phone || ''} 
            ${resume.linkedIn ? `| LinkedIn: ${resume.linkedIn}` : ''}
            ${resume.github ? `| GitHub: ${resume.github}` : ''}
            ${resume.website ? `| Website: ${resume.website}` : ''}
          </div>
          
          ${
            resume.summary
              ? `
            <div class="section">
              <h2 class="section-title">Summary</h2>
              <p>${resume.summary}</p>
            </div>
          `
              : ''
          }
          
          <div class="section">
            <h2 class="section-title">Experience</h2>
            ${resume.experience
              .map(
                (exp) => `
              <div class="job">
                <div class="job-title">${exp.jobTitle}</div>
                <div class="company">${exp.company} ${exp.location ? `| ${exp.location}` : ''}</div>
                <div class="date">${exp.startDate} - ${exp.endDate || 'Present'}</div>
                <ul>
                  ${exp.description.map((point) => `<li>${point}</li>`).join('')}
                </ul>
              </div>
            `
              )
              .join('')}
          </div>
          
          <div class="section">
            <h2 class="section-title">Education</h2>
            ${resume.education
              .map(
                (edu) => `
              <div class="education">
                <div class="degree">${edu.degree} ${edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</div>
                <div class="institution">${edu.institution}</div>
                <div class="date">${edu.startDate} - ${edu.endDate || 'Present'}</div>
                ${edu.description ? `<p>${edu.description}</p>` : ''}
              </div>
            `
              )
              .join('')}
          </div>
          
          <div class="section">
            <h2 class="section-title">Skills</h2>
            <div class="skills">
              ${resume.skills
                .map(
                  (skill) => `
                <div class="skill">${skill.name} ${skill.proficiency ? `(${skill.proficiency})` : ''}</div>
              `
                )
                .join('')}
            </div>
          </div>
        </body>
      </html>
    `;

    const options = {
      html,
      fileName: `Resume_${resume.title.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}`,
      directory: 'Documents',
    };

    const file = await RNHTMLtoPDF.convert(options);
    return file.filePath || '';
  } catch (error) {
    console.error('PDF generation error:', error);
    throw error;
  }
};
