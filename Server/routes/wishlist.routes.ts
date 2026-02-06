import express, { Router }  from "express";
import{
    addToWishlist,
    getWishlist,
    removeFromWishlist
}from "../controllers/wishlist.controller"

import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// All wishlist routes require authentication
router.post("/add", authMiddleware, addToWishlist);
router.get("/", authMiddleware, getWishlist);
router.delete("/remove", authMiddleware, removeFromWishlist);

export default router;