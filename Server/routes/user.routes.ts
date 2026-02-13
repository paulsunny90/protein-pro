import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";
import { setPassword, getProfile, getAllUsers } from "../controllers/user.controller";

const router = Router();

router.post("/set-password", authMiddleware, setPassword);

router.get("/profile", authMiddleware, getProfile);

router.get("/all", authMiddleware, adminMiddleware, getAllUsers);

export default router;
