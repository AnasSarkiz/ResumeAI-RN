// import { GoogleGenerativeAI } from 'expo-google-gemini';
// import { Resume } from '../types/resume';
// // import Constants from 'expo-constants'; 

// // Optional: use API key from app config
// const gemini = new GoogleGenerativeAI({
// //   apiKey: Constants.expoConfig?.extra?.googleGeminiApiKey, // fallback to hardcoded key if needed
//   apiKey: 'YOUR_GEMINI_API_KEY', // uncomment if you want to hardcode
// });

// export const generateBulletPoints = async (
//   jobTitle: string,
//   context: string
// ): Promise<string[]> => {
//   try {
//     const prompt = `Generate 5 professional bullet points for a resume based on the job title "${jobTitle}". 
// Here's some context about the user: ${context}. Make the points achievement-oriented and quantifiable where possible.`;

//     const result = await gemini.generateContent({
//       model: 'gemini-pro',
//       prompt,
//     });

//     return result.response.text().split('\n').filter((point) => point.trim() !== '');
//   } catch (error) {
//     console.error('AI generation error:', error);
//     return [];
//   }
// };

// export const rewordText = async (text: string): Promise<string> => {
//   try {
//     const prompt = `Rewrite the following text to sound more professional and polished for a resume: "${text}"`;

//     const result = await gemini.generateContent({
//       model: 'gemini-pro',
//       prompt,
//     });

//     return result.response.text();
//   } catch (error) {
//     console.error('AI reword error:', error);
//     return text;
//   }
// };

// export const generateCoverLetter = async (
//   resume: Resume,
//   company?: string,
//   position?: string
// ): Promise<string> => {
//   try {
//     const prompt = `Write a professional cover letter for the following resume targeting ${
//       position ? `the ${position} position` : 'a job'
//     }${company ? ` at ${company}` : ''}. Here's the resume data:

// Name: ${resume.fullName}
// Email: ${resume.email}
// Experience: ${resume.experience
//       .map((exp) => `${exp.jobTitle} at ${exp.company}`)
//       .join(', ')}
// Education: ${resume.education
//       .map((edu) => `${edu.degree} from ${edu.institution}`)
//       .join(', ')}
// Skills: ${resume.skills.map((skill) => skill.name).join(', ')}

// Make the cover letter concise (3-4 paragraphs), tailored to the position, and highlight relevant experience and skills.`;

//     const result = await gemini.generateContent({
//       model: 'gemini-pro',
//       prompt,
//     });

//     return result.response.text();
//   } catch (error) {
//     console.error('AI cover letter error:', error);
//     return '';
//   }
// };

// export const tailorResume = async (
//   resume: Resume,
//   jobDescription: string
// ): Promise<Resume> => {
//   try {
//     const prompt = `Optimize the following resume for this job description: ${jobDescription}.

// Current resume:
// ${JSON.stringify(resume, null, 2)}

// Return the optimized resume in the exact same JSON format, with improved wording, reordered sections if needed, and emphasis on relevant skills and experience.`;

//     const result = await gemini.generateContent({
//       model: 'gemini-pro',
//       prompt,
//     });

//     return JSON.parse(result.response.text());
//   } catch (error) {
//     console.error('AI tailor error:', error);
//     return resume;
//   }
// };

// export const improveSummary = async (summary: string): Promise<string> => {
//   try {
//     const prompt = `Improve this resume summary to be more compelling and professional: "${summary}"`;

//     const result = await gemini.generateContent({
//       model: 'gemini-pro',
//       prompt,
//     });

//     return result.response.text();
//   } catch (error) {
//     console.error('AI summary error:', error);
//     return summary;
//   }
// };