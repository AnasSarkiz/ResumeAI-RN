import * as Print from 'expo-print';
import { Resume } from '../types/resume';

export const exportResumeToPDF = async (resume: Resume): Promise<string> => {
  try {
    const html = `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <style>
            body { font-family: -apple-system, Arial, Helvetica, sans-serif; padding: 24px; max-width: 800px; margin: 0 auto; }
            h1 { color: #222; margin-bottom: 6px; }
            .contact-info { margin-bottom: 20px; font-size: 14px; color: #555; }
            .section { margin-bottom: 20px; }
            .section-title { border-bottom: 2px solid #333; padding-bottom: 5px; margin-bottom: 10px; font-size: 18px; }
            .job, .education { margin-bottom: 15px; }
            .job-title { font-weight: 600; }
            .company, .institution { font-style: italic; }
            .date { color: #555; font-size: 14px; }
            ul { margin-top: 5px; padding-left: 20px; }
            li { margin-bottom: 4px; }
            .skills { display: flex; flex-wrap: wrap; gap: 10px; }
            .skill { background: #f0f0f0; padding: 5px 10px; border-radius: 3px; }
          </style>
        </head>
        <body>
          <h1>${resume.fullName}</h1>
          <div class="contact-info">
            ${resume.email} | ${resume.phone || ''}
            ${resume.linkedIn ? ` | LinkedIn: ${resume.linkedIn}` : ''}
            ${resume.github ? ` | GitHub: ${resume.github}` : ''}
            ${resume.website ? ` | Website: ${resume.website}` : ''}
          </div>
          ${resume.summary ? `
            <div class="section">
              <div class="section-title">Summary</div>
              <p>${resume.summary}</p>
            </div>
          ` : ''}
          <div class="section">
            <div class="section-title">Experience</div>
            ${resume.experience.map(exp => `
              <div class="job">
                <div class="job-title">${exp.jobTitle}</div>
                <div class="company">${exp.company}${exp.location ? ` | ${exp.location}` : ''}</div>
                <div class="date">${exp.startDate} - ${exp.endDate || 'Present'}</div>
                <ul>
                  ${exp.description.map(point => `<li>${point}</li>`).join('')}
                </ul>
              </div>
            `).join('')}
          </div>
          <div class="section">
            <div class="section-title">Education</div>
            ${resume.education.map(edu => `
              <div class="education">
                <div class="degree">${edu.degree} ${edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</div>
                <div class="institution">${edu.institution}</div>
                <div class="date">${edu.startDate} - ${edu.endDate || 'Present'}</div>
                ${edu.description ? `<p>${edu.description}</p>` : ''}
              </div>
            `).join('')}
          </div>
          <div class="section">
            <div class="section-title">Skills</div>
            <div class="skills">
              ${resume.skills.map(skill => `
                <div class="skill">${skill.name} ${skill.proficiency ? `(${skill.proficiency})` : ''}</div>
              `).join('')}
            </div>
          </div>
        </body>
      </html>
    `;

    const file = await Print.printToFileAsync({ html });
    // file.uri is a 'file://' URI suitable for sharing
    return file.uri;
  } catch (error) {
    console.error('PDF generation error:', error);
    throw error;
  }
};
