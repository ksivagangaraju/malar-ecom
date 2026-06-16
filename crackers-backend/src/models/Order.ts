// src/models/Order.ts
import { Schema, model } from "mongoose";

// Cart lo unna prathi item kosam chinna schema
const OrderItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  price: { type: Number, required: true },
});

// Main Order Schema
const OrderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    orderItems: [OrderItemSchema],
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      district: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
    },
    totalAmount: { type: Number, required: true },
    isPaid: { type: Boolean, default: false },
    orderStatus: {
      type: String,
      enum: [
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
      ],
      default: "Processing",
    },
  },
  { timestamps: true },
);

export const Order = model("Order", OrderSchema);
