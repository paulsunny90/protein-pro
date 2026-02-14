import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateReply = async (message: string, context?: any) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not defined in environment variables");
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-flash-latest",
  });

  let systemPrompt = "You are a health and nutrition assistant for 'Protein Pro', a platform specializing in supplements and fitness. ";

  if (context && context.bmi) {
    systemPrompt += `The user has a BMI of ${context.bmi}, which is categorized as '${context.category}'. `;
    if (context.healthRisk) {
      systemPrompt += `Their health risk level is: ${context.healthRisk}. `;
    }
  }

  systemPrompt += "\n\nProvide helpful, encouraging, and accurate advice regarding nutrition, exercise, and supplements. Keep your responses concise and professional.";

  const prompt = `${systemPrompt}\n\nUser: ${message}\nAssistant:`;

  console.log("Generating reply for message:", message);
  const result = await model.generateContent(prompt);
  const responseText = result.response.text();
  console.log("AI Response received successfully");

  return responseText;
};
