process.removeAllListeners("warning");
process.on("warning", () => {});
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { createInterface } from "node:readline/promises"
import { tavily } from "@tavily/core";
dotenv.config({ quiet: true });

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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

async function main() {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const systemInstruction = `You are a smart personal assistant who answers the asked questions made by and trained by the darkKnights.
        you have access to following tools :
        1.webSearch((query):{query:"String"}) //Search the latest information and realtime news about a topic.`;

  

  while (true) {
    const question = await rl.question("You: ");
    if (question === "bye") break;
    const contents = [
      {
        role: "user",
        parts: [{ text: question }],
      },
    ];

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
        console.log(response.text);
        break;
      }

      contents.push(response.candidates[0].content)

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
  rl.close();
}

main();

async function webSearch({ query }) {
  const response = await tvly.search(query);

  const result = response.results.map((result) => result.content).join("\n\n");

  return result;
}
