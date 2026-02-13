import express from "express";
import { createOrder, getOrderById, getAllOrders } from "../controllers/order.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

// // Dummy auth middleware
const protect = (req: any, res: any, next: any) => {
  req.user = { id: "64ca2f0b1234567890abcdef" };
  next();
};

import { adminMiddleware } from "../middleware/admin.middleware";

// router.route("/").post(protect, createOrder);
// router.route("/:id").get(protect, getOrderById);
router.route("/").post(authMiddleware, createOrder).get(authMiddleware, adminMiddleware, getAllOrders);
router.route("/:id").get(authMiddleware, getOrderById);

export default router; 
