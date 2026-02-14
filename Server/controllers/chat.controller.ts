import { generateReply } from "../services/gemini.service";

export const chatController = async (req: any, res: any) => {
  try {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const reply = await generateReply(message, context);

    res.status(200).json({
      success: true,
      reply,
    });
  } catch (error: any) {
    console.error("Chat Error:", error);

    let errorMessage = error.message || "An unexpected error occurred";
    let statusCode = 500;

    if (error.status === 429 || error.message?.includes("429")) {
      errorMessage = "The AI service is currently busy (Rate Limit Exceeded). Please try again in a few seconds.";
      statusCode = 429;
    } else if (error.status === 404) {
      errorMessage = "AI Model not found or unavailable.";
      statusCode = 404;
    }

    res.status(statusCode).json({
      success: false,
      error: errorMessage,
    });
  }
};
