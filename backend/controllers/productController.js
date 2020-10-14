import Product from "../models/productModel.js"
import asyncHandler from "express-async-handler"

const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 10
  const page = Number(req.query.pageNumber) || 1

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {}

  const count = await Product.countDocuments({ ...keyword })
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1))

  if (!products) {
    res.status(404)
    throw new Error("No products found")
  }

  res.json({ products, pages: Math.ceil(count / pageSize), page })
})

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (!product) {
    res.status(404)
    throw new Error("Product not found")
  }

  res.json(product)
})

const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      res.status(404)
      throw new Error("No product found")
    }
    await product.remove()
    res.json("product removed")
  } catch (err) {
    res.status(404)
    throw new Error("Product not found")
  }
})

const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: "Sample product",
    image: "/images/sample.jpg",
    description: "sample description",
    brand: "sample brand",
    category: "sample catergory",
    price: 0,
    countInStock: 0,
    numReviews: 0,
    user: req.user._id,
  })

  const createdProduct = await product.save()
  res.status(201).json(createdProduct)
})

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      res.status(404)
      throw new Error("No product found")
    }

    const {
      name,
      price,
      description,
      brand,
      image,
      category,
      countInStock,
      numReviews,
    } = req.body
    product.name = name
    product.price = price
    product.description = description
    product.image = image
    product.brand = brand
    product.category = category
    product.countInStock = countInStock
    product.numReviews = numReviews

    const updatedProduct = await product.save()
    res.json(updatedProduct)
  } catch (err) {
    res.json(err)
  }
}
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body

  const product = await Product.findById(req.params.id)

  if (!product) {
    res.status(404)
    throw new Error("No product found")
  }

  const alreadyReviewed = product.review.find(
    (prod) => prod.user.toString() === req.user._id.toString()
  )

  if (alreadyReviewed) {
    res.status(400)
    throw new Error("Product already reviewd")
  }

  const review = { name: req.user.name, rating, comment, user: req.user._id }

  product.review.push(review)

  product.numReviews = product.review.length

  product.rating =
    product.review.reduce((acc, item) => acc + item.rating, 0) /
    product.review.length

  await product.save()
  res.json({ message: "Review added" })
})

const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3)
  res.json(products)
})

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
}
