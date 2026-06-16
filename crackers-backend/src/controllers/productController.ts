// src/controllers/productController.ts
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Product } from "../models/Product.js";
import { User } from "../models/User.js";

// 1. Add Product API (Testing kosam, ideally Admin only)
export const createProduct = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ message: "Product added successfully", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding product" });
  }
};

// 2. Get Products API (with Public Access & Optional VIP Gold Discount)
export const getProducts = async (
  req: Request, // AuthRequest theesesam endukante idi public API kabatti
  res: Response,
): Promise<any> => {
  try {
    const products = await Product.find();
    let isVip = false;

    // Optional Token Checking: Customer login ayi unte token vastundi
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        const token = req.headers.authorization.split(" ")[1];
        if (token) {
          const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string,
          ) as any;
          const user = await User.findById(decoded.id);
          if (user && user.isVipGold) {
            isVip = true; // Customer VIP ani confirm ayyindi
          }
        }
      } catch (error) {
        // Token thedakodithe em kadu, just normal customer laaga treat chestham
        console.log("Token check failed, treating as normal customer.");
      }
    }

    // Prathi product ki dynamic ga price calculate chestunnam
    const formattedProducts = products.map((product) => {
      let finalPrice = product.price;
      let vipDiscountMsg = null;

      // User VIP Gold ayithe extra 15% discount
      if (isVip) {
        finalPrice = Math.round(product.price * 0.85); // 15% off
        vipDiscountMsg = "🎉 15% VIP Gold Discount Applied!";
      }

      // Patha properties (images, stock) anni pampisthu, kotha variables add chestunnam
      return {
        ...product.toObject(),
        normalSellingPrice: product.price,
        yourFinalPrice: finalPrice,
        vipMessage: vipDiscountMsg,
      };
    });

    res.status(200).json(formattedProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching products" });
  }
};
