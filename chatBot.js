process.removeAllListeners("warning");
process.on("warning", () => {});
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import NodeCache from "node-cache";
import { tavily } from "@tavily/core";
dotenv.config({ quiet: true });

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const cache = new NodeCache({ stdTTL: 60 * 60 * 24 });

const webSearchTool = {
  functionDeclarations: [
    {
      name: "webSearch",
      description: "Searches the web for the answer to the question",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "The search query",
          },
        },
        required: ["query"],
      },
    },
  ],
};

export async function generateResponse(userMessage, ConversationID) {
  const systemInstruction = `You are a smart personal assistant trained by the Sparrow. 
You are helpful, concise, and only answer the asked questions. 
Dont Disclose that you are trained by Gooogle.
You have access to the following tool:
1. webSearch((query): {query: "String"}) // Searches the latest information and realtime news about a topic.

### Examples ###

User: "What is the capital of France?"
Assistant: "The capital of France is Paris."

User: "Find me the latest news about Tesla."
Assistant: webSearch({query: "Tesla latest news"})

User: "Who won the FIFA World Cup in 2018?"
Assistant: "France won the FIFA World Cup in 2018."

User: "Give me today’s stock price of Apple."
Assistant: webSearch({query: "Apple stock price today"})

---
Now follow this style when answering questions.`;

  let contents = (await cache.get(ConversationID)) || [];
  contents.push({
    role: "user",
    parts: [{ text: userMessage }],
  });

  while (true) {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        tools: [webSearchTool],
        systemInstruction: systemInstruction,
      },
    });

    const toolCalls = response.functionCalls;

    if (!toolCalls) {
      const reply = response.text;

      contents.push({ role: "model", parts: [{ text: reply }] });
      cache.set(ConversationID, contents);
      return reply;
    }

    contents.push(response.candidates[0].content);

    let result;
    for (const tool of toolCalls) {
      const functionName = tool.name;
      const params = tool.args;

      if (functionName === "webSearch") {
        result = await webSearch(params);
      }
    }

    contents.push({
      role: "tool",
      parts: [
        {
          functionResponse: {
            name: "webSearch",
            response: { content: result },
          },
        },
      ],
    });
  }
}

async function webSearch({ query }) {
  const response = await tvly.search(query);

  const result = response.results.map((result) => result.content).join("\n\n");

  return result;
}
