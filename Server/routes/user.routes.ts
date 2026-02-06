import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { setPassword, getProfile } from "../controllers/user.controller";

const router = Router();

router.post("/set-password", authMiddleware, setPassword);

router.get("/profile", authMiddleware, getProfile);

export default router;
