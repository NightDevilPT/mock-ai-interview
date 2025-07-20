import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export const model = new ChatGoogleGenerativeAI({
	model: "gemini-2.5-flash",
	temperature: 0.3,
	apiKey: process.env.GEMINI_API_KEY,
});
