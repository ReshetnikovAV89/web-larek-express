import { Router } from "express";
import { createProduct, getProducts } from "../controllers/product";
import { validateCreateProduct } from "../middlewares/validation";

const router = Router();

router.get("/", getProducts);
router.post("/", validateCreateProduct, createProduct);

export default router;
