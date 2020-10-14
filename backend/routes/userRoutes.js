import express from "express"
const router = express.Router()
import {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
} from "../controllers/userController.js"
import { authMiddleware, admin } from "../middleware/authMiddleware.js"

router.route("/").post(registerUser).get(authMiddleware, admin, getUsers)
router.route("/login").post(authUser)
router
  .route("/profile")
  .get(authMiddleware, getUserProfile)
  .put(authMiddleware, updateUserProfile)
router
  .route("/:id")
  .delete(authMiddleware, admin, deleteUser)
  .get(authMiddleware, admin, getUserById)
  .put(authMiddleware, admin, updateUser)

export default router
