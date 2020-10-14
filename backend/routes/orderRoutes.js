import express from "express"
const router = express.Router()
import { authMiddleware, admin } from "../middleware/authMiddleware.js"
import {
  addOrderItems,
  getOrderItemsById,
  updateOrderToPaid,
  getMyOrders,
  getAllOrders,
  updateOrderToDelivered,
} from "../controllers/orderController.js"

router
  .route("/")
  .post(authMiddleware, addOrderItems)
  .get(authMiddleware, admin, getAllOrders)
router.route("/:id").get(authMiddleware, getOrderItemsById)
router.route("/:id/pay").put(authMiddleware, updateOrderToPaid)
router.route("/:id/deliver").put(authMiddleware, admin, updateOrderToDelivered)

router.route("/orders/myorder").get(authMiddleware, getMyOrders)

export default router
