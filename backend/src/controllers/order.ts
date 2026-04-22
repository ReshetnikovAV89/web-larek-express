import { NextFunction, Request, Response } from "express";
import { faker } from "@faker-js/faker";
import Product from "../models/product";
import BadRequestError from "../errors/bad-request-error";

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { items, total, payment, email, phone, address } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return next(new BadRequestError("Items are required"));
    }

    if (!payment || !email || !phone || !address || total === undefined) {
      return next(new BadRequestError("Invalid order data"));
    }

    const products = await Product.find({ _id: { $in: items } });

    if (products.length !== items.length) {
      return next(new BadRequestError("Some products not found"));
    }

    const hasUnavailableProduct = products.some(
      (product) => product.price === null,
    );

    if (hasUnavailableProduct) {
      return next(new BadRequestError("Some products are unavailable"));
    }

    const calculatedTotal = products.reduce(
      (sum, product) => sum + (product.price || 0),
      0,
    );

    if (calculatedTotal !== total) {
      return next(new BadRequestError("Total amount is invalid"));
    }

    return res.json({
      id: faker.string.uuid(),
      total: calculatedTotal,
    });
  } catch (err) {
    return next(err);
  }
};
