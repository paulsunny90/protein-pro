import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const generateReply = async (message: string, context?: any) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
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

  const result = await model.generateContent(prompt);

  return result.response.text();
};
