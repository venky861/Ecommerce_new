import express from "express"
import { notFound, errorHandler } from "./middleware/errorMiddleware.js"
import dotenv from "dotenv"
dotenv.config()

import morgan from "morgan"
import productRoutes from "./routes/productRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import uploadRoutes from "./routes/uploadRoutes.js"

import connectDB from "./config/db.js"
import path from "path"

connectDB()

const app = express()

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"))
}

app.use(express.json())
app.use("/api/products", productRoutes)
app.use("/api/users", userRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/upload", uploadRoutes)

app.get("/api/config/paypal", (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
)

const __dirname = path.resolve()
//console.log(__dirname)
//console.log(path.join(__dirname, "uploads"))

app.use("/uploads", express.static(path.join(__dirname, "uploads")))

//console.log("paypal ID", process.env.PAYPAL_CLIENT_ID)
// console.log("file", path.resolve(__dirname, "client", "build", "index.html"))
// console.log("static", path.join(__dirname, "/client/build"))

if (process.env.NODE_ENV === "production") {
  console.log("i am in production")
  app.use(express.static(path.join(__dirname, "/client/build")))

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  })
}

app.use(notFound)

app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(
  PORT,
  console.log(`Server is running on PORT ${PORT} on ${process.env.NODE_ENV}`)
)
