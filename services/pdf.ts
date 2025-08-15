import * as Print from 'expo-print';
import { SavedResume } from '../types/resume';
// import { renderHTMLTemplate, TemplateId } from './templates';

// Ensure HTML is wrapped with A4 print CSS
const ensureA4HTML = (html: string): string => {
  const a4Style = `
    <style>
      @page { size: A4; margin: 12mm; }
      html, body { width: 210mm; }
      body { margin: 0 auto; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .page { width: 210mm; min-height: 297mm; }
    </style>
  `;
  const hasHtmlTag = /<html[\s\S]*?>/i.test(html);
  const hasHeadTag = /<head[\s\S]*?>/i.test(html);

  if (hasHtmlTag) {
    if (hasHeadTag) {
      return html.replace(/<head(.*?)>/i, (m) => `${m}\n${a4Style}`);
    }
    return html.replace(/<html(.*?)>/i, (m) => `${m}\n<head>${a4Style}</head>`);
  }

  // Wrap fragments in full document with A4 styling
  return `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      ${a4Style}
    </head>
    <body>
      <div class="page">${html}</div>
    </body>
  </html>`;
};

export const exportHTMLToPDF = async (html: string): Promise<string> => {
  try {
    const file = await Print.printToFileAsync({ html: ensureA4HTML(html) });
    return file.uri;
  } catch (error) {
    console.error('PDF generation error (HTML):', error);
    throw error;
  }
};

export const exportResumeToPDF = async (resume: SavedResume): Promise<string> => {
  try {
    const html = resume.html;
    const file = await Print.printToFileAsync({ html: ensureA4HTML(html) });
    // file.uri is a 'file://' URI suitable for sharing
    return file.uri;
  } catch (error) {
    console.error('PDF generation error:', error);
    throw error;
  }
};
