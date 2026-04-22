import { Request, Response } from "express";
import { faker } from "@faker-js/faker";
import Product from "../models/product";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { items, total, payment, email, phone, address } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Items are required" });
    }

    if (!payment || !email || !phone || !address || total === undefined) {
      return res.status(400).json({ message: "Invalid order data" });
    }

    const products = await Product.find({ _id: { $in: items } });

    if (products.length !== items.length) {
      return res.status(400).json({ message: "Some products not found" });
    }

    const hasUnavailableProduct = products.some(
      (product) => product.price === null,
    );

    if (hasUnavailableProduct) {
      return res.status(400).json({ message: "Some products are unavailable" });
    }

    const calculatedTotal = products.reduce(
      (sum, product) => sum + (product.price || 0),
      0,
    );

    if (calculatedTotal !== total) {
      return res.status(400).json({ message: "Total amount is invalid" });
    }

    return res.json({
      id: faker.string.uuid(),
      total: calculatedTotal,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
