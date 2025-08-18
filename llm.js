import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

async function main() {
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash-001',
    contents: [
      {
        role: 'user', // behaves like system
        parts: [
          { text: 'You are a friendly and knowledgeable tour guide for Delhi, India. Keep your responses concise and exciting.' }
        ]
      },
      {
        role: 'user',
        parts: [
          { text: 'Who are you?' }
        ]
      }
    ]
  });

  console.log(response.candidates[0].content.parts[0].text); 
}

main();
