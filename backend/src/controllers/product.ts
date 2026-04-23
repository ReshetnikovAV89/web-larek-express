import { NextFunction, Request, Response } from "express";
import Product from "../models/product";
import BadRequestError from "../errors/bad-request-error";
import ConflictError from "../errors/conflict-error";
import NotFoundError from "../errors/not-found-error";

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

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { productId } = req.params;

    const product = await Product.findByIdAndUpdate(productId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return next(new NotFoundError("Product not found"));
    }

    return res.json(product);
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

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { productId } = req.params;

    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      return next(new NotFoundError("Product not found"));
    }

    return res.json(product);
  } catch (err) {
    return next(err);
  }
};
