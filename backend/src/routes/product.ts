import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../controllers/product";
import {
  validateCreateProduct,
  validateProductId,
  validateUpdateProduct,
} from "../middlewares/validation";
import auth from "../middlewares/auth";

const router = Router();

router.get("/", getProducts);
router.post("/", auth, validateCreateProduct, createProduct);
router.patch(
  "/:productId",
  auth,
  validateProductId,
  validateUpdateProduct,
  updateProduct,
);
router.delete("/:productId", auth, validateProductId, deleteProduct);

export default router;
