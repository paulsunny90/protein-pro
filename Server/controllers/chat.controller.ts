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
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
