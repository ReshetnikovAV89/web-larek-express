import { Request, Response } from "express";
import Product from "../models/product";

export const getProducts = async (_req: Request, res: Response) => {
  const items = await Product.find({});
  res.json({
    items,
    total: items.length,
  });
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.create(req.body);

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
