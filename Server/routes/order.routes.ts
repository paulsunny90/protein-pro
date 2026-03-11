import express from "express";
import { createOrder, getOrderById, getAllOrders, updateOrderToPaid, getMyOrders, updateOrder } from "../controllers/order.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();



import { adminMiddleware } from "../middleware/admin.middleware";

// router.route("/").post(protect, createOrder);
// router.route("/:id").get(protect, getOrderById);
router.route("/").post(authMiddleware, createOrder).get(authMiddleware, adminMiddleware, getAllOrders);
router.get("/myorders", authMiddleware, getMyOrders);
router.route("/:id")
  .get(authMiddleware, getOrderById)
  .put(authMiddleware, adminMiddleware, updateOrder);
router.route("/:id/pay").put(authMiddleware, updateOrderToPaid);

export default router; 
