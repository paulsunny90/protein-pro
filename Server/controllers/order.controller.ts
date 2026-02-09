import { Request, Response } from "express";
import OrderModel from "../models/Order.model";
// import "../models/user.model.js";

// Create order and mark as paid
// export const createOrder = async (req: Request, res: Response) => {
//   try {
//     const { orderItems, shippingAddress, itemsPrice, shippingPrice, totalPrice } = req.body;

//     if (!orderItems || orderItems.length === 0)
//       return res.status(400).json({ message: "No order items" });

//     const order = new OrderModel({
//       user: req.user?.id,
//       orderItems,
//       shippingAddress,
//       paymentMethod: "ONLINE",   //payment methos set here
//       itemsPrice,
//       shippingPrice,
//       totalPrice,
//       isPaid: true,             //this is the payment status
//       paidAt: new Date(),
//       orderStatus: "Confirmed",
//     });

//     const createdOrder = await order.save();
//     res.status(201).json(createdOrder);
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { orderItems, shippingAddress, itemsPrice, shippingPrice, totalPrice } = req.body;

    const userId = req.user?.id || (req.user as any)?._id;

    if (!userId) {
      return res.status(401).json({ message: "Authentication failed. No user ID found." });
    }

    // Check if user exists from authMiddleware
    if (!req.user) return res.status(401).json({ message: "User not found in request" });

    const order = new OrderModel({
      user: req.user.id,
      orderItems,
      shippingAddress,
      paymentMethod: "ONLINE",
      itemsPrice,
      shippingPrice,
      totalPrice,
      isPaid: true,
      paidAt: new Date(),
      orderStatus: "Confirmed",
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error: any) {
    console.error("BACKEND ERROR:", error.message); // This shows in your terminal
    res.status(500).json({ message: error.message });
  }
};

// Get order by ID
// export const getOrderById = async (req: Request, res: Response) => {
//   try {
//     const order = await OrderModel.findById(req.params.id)
//       .populate("orderItems.product")
//       // .populate("shippingAddress");
//     if (!order) return res.status(404).json({ message: "Order not found" });
//     res.json(order);
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const order = await OrderModel.findById(id);
    // REMOVE .populate("orderItems.product") if your IDs are "2", "6", etc.
    // REMOVE .populate("user") if you still get the Schema error.

    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json(order);
  } catch (error: any) {
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};

export const getAllOrders = async (_req: Request, res: Response) => {
  try {
    const orders = await OrderModel.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error: any) {
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};