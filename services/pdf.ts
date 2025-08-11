import * as Print from 'expo-print';
import { Resume } from '../types/resume';
import { renderHTMLTemplate, TemplateId } from './templates';

export const exportHTMLToPDF = async (html: string): Promise<string> => {
  try {
    const file = await Print.printToFileAsync({ html });
    return file.uri;
  } catch (error) {
    console.error('PDF generation error (HTML):', error);
    throw error;
  }
};

export const exportResumeToPDF = async (
  resume: Resume,
  template: TemplateId = 'classic'
): Promise<string> => {
  try {
    const html = renderHTMLTemplate(resume, template);
    const file = await Print.printToFileAsync({ html });
    // file.uri is a 'file://' URI suitable for sharing
    return file.uri;
  } catch (error) {
    console.error('PDF generation error:', error);
    throw error;
  }
};
