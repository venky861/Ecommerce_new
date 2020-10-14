import jwt from "jsonwebtoken"
import User from "../models/userModel.js"
import asyncHandler from "express-async-handler"

const authMiddleware = asyncHandler(async (req, res, next) => {
  //
  let validToken =
    req.headers.authorization && req.headers.authorization.startsWith("Bearer")

  if (!validToken) {
    res.status(401)
    throw new Error("No token , authorization denied")
  }

  try {
    let token = req.headers.authorization.split(" ")[1]

    const decoded = jwt.verify(token, process.env.JWT_TOKEN)

    req.user = await User.findById(decoded.id).select("-password")

    next()
  } catch (err) {
    res.status(401)
    throw new Error("No token , authorization denied")
  }
})

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next()
  } else {
    res.status(401)
    throw new Error("Athorization denied")
  }
}

export { authMiddleware, admin }
