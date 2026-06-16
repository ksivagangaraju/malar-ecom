// src/models/Product.ts
import { Schema, model } from "mongoose";

const ProductSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    images: [{ type: String }], // Cloudinary/AWS URL strings kosam
    mrpPrice: { type: Number, required: true },
    price: { type: Number, required: true }, // Normal Selling Price
    stock: { type: Number, required: true, default: 50 },
  },
  { timestamps: true },
);

export const Product = model("Product", ProductSchema);
