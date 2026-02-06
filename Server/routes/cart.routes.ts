import { Router } from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
  updateCartItem,
  clearCart
} from "../controllers/cart.controller";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

// All cart routes require authentication
router.post("/add", authMiddleware, addToCart);
router.get("/", authMiddleware, getCart);
router.delete("/remove/:productId", authMiddleware, removeFromCart);
router.put("/update", authMiddleware, updateCartItem);
router.delete("/clear", authMiddleware, clearCart);

export default router;
