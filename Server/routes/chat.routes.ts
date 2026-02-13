import express from "express";
import { chatController } from "../controllers/chat.controller";

const router = express.Router();

router.post("/chat", chatController);

export default router;
