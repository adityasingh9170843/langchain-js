import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import dotenv from 'dotenv';

dotenv.config({ quiet: true });


const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
  model: "gemini-2.5-pro",
  maxOutputTokens: 1000,
});

const response = await model.stream("write a short story about a dog");

for await (const chunk of response) {
  console.log(chunk?.content);
}