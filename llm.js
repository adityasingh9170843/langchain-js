process.removeAllListeners("warning");
process.on("warning", () => {});
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { tavily } from "@tavily/core";
dotenv.config({quiet: true});


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
  
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "What's the current price of Nvidia stock?",
    config: {
      tools: [webSearchTool],
      systemInstruction:
        "You are a smart personal assistant who answers the asked questions.",
    },
    
  });


  
  const toolCalls = response.functionCalls;

  if(!toolCalls) {
    console.log("No tool calls found");
    return;
  }
  
  for(const tool of toolCalls){
    
    const functionName = tool.name;
    const params = tool.args

    if(functionName === 'webSearch'){
      const result = await webSearch(params);
      console.log(result);
    }

  }


}
  

main();


async function webSearch({ query }) {

  const response = await tvly.search(query);
  const result = response.results.map(result => result.content).join("\n\n");

  return result;
}
