// src/controllers/orderController.ts

import type { Response } from "express";

import { Order } from "../models/Order.js";

import type { AuthRequest } from "../middleware/authMiddleware.js";

// 1. Place New Order API (WhatsApp URL Redirect Model)

export const placeOrder = async (
  req: AuthRequest,

  res: Response,
): Promise<any> => {
  try {
    const { orderItems, shippingAddress, totalAmount } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items found" });
    }

    const order = new Order({
      user: req.user.id,

      orderItems,

      shippingAddress,

      totalAmount,
    });

    const createdOrder = await order.save();

    // Admin Number thechukuntunnam (.env nundi)

    const adminPhone = process.env.ADMIN_WHATSAPP_NUMBER || "919876543210";

    // WhatsApp kosam message text ni format chestunnam

    const message = `*New Order Alert!*\n\n*Order ID:* ${createdOrder._id}\n*Customer ID:* ${req.user.id}\n*Total Amount:* ₹${totalAmount}\n*Status:* Processing\n\nHi Admin, please confirm my order!`;

    // Message ni URL loki pampadaniki encode chestunnam (spaces ki %20 ila marthayi)

    const encodedMessage = encodeURIComponent(message);

    // Frontend ki ivvadaniki WhatsApp URL create chestunnam

    const whatsappUrl = `https://wa.me/${adminPhone}?text=${encodedMessage}`;

    // Response lo order tho patu whatsappUrl kuda isthunnam

    res.status(201).json({
      message: "Order placed successfully",

      order: createdOrder,

      whatsappRedirectUrl: whatsappUrl,
    });
  } catch (error) {
    console.error("Order Place Error:", error);

    res.status(500).json({ message: "Error placing order" });
  }
};

// 2. Cancel Order API (WhatsApp URL Redirect Model)

export const cancelOrder = async (
  req: AuthRequest,

  res: Response,
): Promise<any> => {
  try {
    const orderId = req.params.id;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res

        .status(403)

        .json({ message: "Not authorized to cancel this order" });
    }

    order.orderStatus = "Cancelled";

    await order.save();

    const adminPhone = process.env.ADMIN_WHATSAPP_NUMBER || "919876543210";

    const message = `❌ *Order Cancelled!*\n\n*Order ID:* ${order._id}\n*Amount:* ₹${order.totalAmount}\n*Status:* Cancelled by user.\n\nHi Admin, I want to cancel this order.`;

    const encodedMessage = encodeURIComponent(message);

    const whatsappUrl = `https://wa.me/${adminPhone}?text=${encodedMessage}`;

    // Response lo whatsappUrl isthunnam

    res.status(200).json({
      message: "Order cancelled successfully",

      order,

      whatsappRedirectUrl: whatsappUrl,
    });
  } catch (error) {
    console.error("Order Cancel Error:", error);

    res.status(500).json({ message: "Error cancelling order" });
  }
};

// 3. Get Logged in User Orders API

export const getMyOrders = async (
  req: AuthRequest,

  res: Response,
): Promise<any> => {
  try {
    // User ID base chesukuni orders thechukuntunnam, latest order first vachela sort chestunnam

    const orders = await Order.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Fetch Orders Error:", error);

    res.status(500).json({ message: "Error fetching your orders" });
  }
};
