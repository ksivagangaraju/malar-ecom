// src/controllers/adminController.ts
import type { Request, Response } from "express";
import { Order } from "../models/Order.js";
import { User } from "../models/User.js";

// 1. Order Status Pipeline Update (Admin Only)
export const updateOrderStatus = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "Ordered",
      "Processing",
      "Confirmed",
      "Picking",
      "Packing",
      "Dispatched",
      "Shipped",
      "In Transit",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status provided!" });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus: status },
      { returnDocument: "after" }, // Idi kotha standard
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res
      .status(200)
      .json({ message: `Order status updated to ${status}`, order });
  } catch (error) {
    res.status(500).json({ message: "Error updating order status" });
  }
};

// 2. Customer VIP Status Control (Admin Only)
export const manageCustomerVip = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { customerId } = req.params;
    const { isVipGold, vipRequestStatus } = req.body;

    const user = await User.findById(customerId);
    if (!user) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Admin ishtam vachinattu customer vip ni true/false cheyachu
    if (isVipGold !== undefined) user.isVipGold = isVipGold;

    // Okavela customer request pampithe, daanni Approve/Reject cheyachu
    if (vipRequestStatus !== undefined)
      user.vipRequestStatus = vipRequestStatus;

    await user.save();

    res
      .status(200)
      .json({ message: "Customer VIP status updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error updating customer VIP status" });
  }
};
