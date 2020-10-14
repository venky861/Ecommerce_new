import User from "../models/userModel.js"
import asyncHandler from "express-async-handler"
import generateToken from "../utils/generateToken.js"

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  let userAndPasswordMatches = user && (await user.matchPassword(password))

  if (!userAndPasswordMatches) {
    res.status(401)
    throw new Error("Invalid credentials")
  }
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    token: generateToken(user._id),
  })

  const payload = {
    user: {
      id: user._id,
    },
  }
})

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  const userExist = await User.findOne({ email })

  if (userExist) {
    res.status(400)
    throw new Error("User already exist")
  }

  const user = await User.create({
    name,
    email,
    password,
  })

  if (!user) {
    res.status(400)
    throw new Error("User entered invalid data")
  }

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    token: generateToken(user._id),
  })
})

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (!user) {
    res.status(401)
    throw new Error("No user found")
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  })
})

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (!user) {
    res.status(401)
    throw new Error("No user found")
  }

  user.name = req.body.name || user.name
  user.email = req.body.email || user.email

  if (req.body.password) {
    user.password = req.body.password
  }

  const updatedUser = await user.save()
  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    isAdmin: updatedUser.isAdmin,
    token: generateToken(updatedUser._id),
  })
})

const getUsers = asyncHandler(async (req, res) => {
  const user = await User.find({})

  if (!user) {
    res.status(401)
    throw new Error("No user found")
  }

  res.json({
    user,
  })
})

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    res.status(401)
    throw new Error("No user found")
  }

  await user.remove()
  res.json({ message: "User removed" })
})

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password")

  if (!user) {
    res.status(401)
    throw new Error("No user found")
  }

  res.json(user)
})

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    res.status(401)
    throw new Error("No user found")
  }

  user.name = req.body.name || user.name
  user.email = req.body.email || user.email
  user.isAdmin = req.body.isAdmin

  const updatedUser = await user.save()
  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    isAdmin: updatedUser.isAdmin,
  })
})

export {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
}
