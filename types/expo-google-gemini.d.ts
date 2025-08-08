// types/expo-google-gemini.d.ts
declare module 'expo-google-gemini' {
  export class GoogleGenerativeAI {
    constructor(config?: { apiKey?: string });

    generateContent(config: {
      model: string;
      prompt: string;
    }): Promise<{
      response: {
        text(): string;
      };
    }>;
  }
}