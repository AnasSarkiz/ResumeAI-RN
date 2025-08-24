import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import { SavedResume } from '../types/resume';

// Ensure HTML is wrapped with A4 print CSS compatible with MULTI-PAGE output
export const ensureA4HTML = (html: string): string => {
  const a4Style = `
    <style>
      /* Global A4 setup with multi-page support */
      @page { size: A4; margin: 15mm; }
      html, body { margin: 0; padding: 0; }
      * { box-sizing: border-box; }
      /* One wrapper per A4 page */
      .page { width: 210mm; min-height: 297mm; padding: 15mm; position: relative; }
      .page + .page { page-break-before: always; }
      /* Avoid internal breaks for common blocks */
      .section, .item, .card, .container, .content { break-inside: avoid; page-break-inside: avoid; }
      @media print {
        .page { break-inside: avoid; }
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      }
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
    const options = {
      html: ensureA4HTML(html || ''),
      width: 595,  // A4 width in points (72dpi)
      height: 842, // A4 height in points (72dpi)
      base64: true,
    };

    // Generate PDF as base64
    const { uri } = await Print.printToFileAsync(options);
    
    // On Android, we need to convert the file to a proper URI
    if (Platform.OS === 'android') {
      const base64Data = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const newUri = `${FileSystem.documentDirectory}resume-${Date.now()}.pdf`;
      await FileSystem.writeAsStringAsync(newUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return newUri;
    }
    
    return uri;
  } catch (error) {
    console.error('PDF generation error (HTML):', error);
    throw error;
  }
};

export const exportResumeToPDF = async (resume: SavedResume): Promise<string> => {
  try {
    const html = resume.html || '';
    return await exportHTMLToPDF(html);
  } catch (error) {
    console.error('PDF generation error:', error);
    throw error;
  }
};
