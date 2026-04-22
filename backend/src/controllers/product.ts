import { NextFunction, Request, Response } from "express";
import Product from "../models/product";
import BadRequestError from "../errors/bad-request-error";
import ConflictError from "../errors/conflict-error";

export const getProducts = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const items = await Product.find({});

    return res.json({
      items,
      total: items.length,
    });
  } catch (err) {
    return next(err);
  }
};

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const product = await Product.create(req.body);

    return res.status(201).json(product);
  } catch (err) {
    if (err instanceof Error && err.message.includes("E11000")) {
      return next(new ConflictError("Product with this title already exists"));
    }

    if (err instanceof Error && err.name === "ValidationError") {
      return next(new BadRequestError("Invalid product data"));
    }

    return next(err);
  }
};
