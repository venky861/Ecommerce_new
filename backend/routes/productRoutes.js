import express from "express"
const router = express.Router()
import {
  getProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  createProduct,
  createProductReview,
  getTopProducts,
} from "../controllers/productController.js"
import { authMiddleware, admin } from "../middleware/authMiddleware.js"

router.route("/").get(getProducts).post(authMiddleware, admin, createProduct)
router.get("/top", getTopProducts)
router.route("/:id/reviews").post(authMiddleware, createProductReview)
router
  .route("/:id")
  .get(getProductById)
  .delete(authMiddleware, admin, deleteProduct)
  .put(authMiddleware, admin, updateProduct)

export default router
