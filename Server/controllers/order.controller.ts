import { Request, Response } from "express";
import OrderModel from "../models/Order.model";


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

// Update order to paid
export const updateOrderToPaid = async (req: Request, res: Response) => {
  try {
    const order = await OrderModel.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = new Date();
      order.orderStatus = "Confirmed";
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer.email_address,
      };

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error: any) {
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};

export const getAllOrders = async (_req: Request, res: Response) => {
  try {
    const orders = await OrderModel.find()
      .populate('user', 'name email')
      .populate('orderItems.product')
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error: any) {
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};

export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id || (req.user as any)?._id;
    const orders = await OrderModel.find({ user: userId })
      .populate("orderItems.product")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};

export const updateOrder = async (req: Request, res: Response) => {
  try {
    const order = await OrderModel.findById(req.params.id);

    if (order) {
      order.orderStatus = req.body.orderStatus || order.orderStatus;
      if (typeof req.body.isPaid !== 'undefined') order.isPaid = req.body.isPaid;
      if (req.body.shippingAddress) order.shippingAddress = req.body.shippingAddress;

      if (req.body.orderItems) {
        order.orderItems = req.body.orderItems;
        if (req.body.totalPrice) order.totalPrice = req.body.totalPrice;
        if (req.body.itemsPrice) order.itemsPrice = req.body.itemsPrice;
      }

      if (order.orderStatus === 'Delivered') {
        order.deliveredAt = new Date();
      }

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error: any) {
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};
