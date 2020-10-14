import products from "./products.js"
import mongoose from "mongoose"
import User from "./models/userModel.js"
import Product from "./models/productModel.js"
import Order from "./models/orderModel.js"
import users from "./users.js"

const MONGO_URI =
  "mongodb+srv://venky_1044:Venkitheviper3@cluster0.vra7y.mongodb.net/Ecommerce?retryWrites=true&w=majority"

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })
    console.log("mongodb connected")
  } catch (err) {
    console.log(err)
    //exit
    process.exit(1)
  }
}

connectDB()

const importData = async () => {
  try {
    await User.deleteMany()
    await Product.deleteMany()
    await Order.deleteMany()

    const createdUsers = await User.insertMany(users)

    const adminUser = createdUsers[0]._id

    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser }
    })

    await Product.insertMany(sampleProducts)
    console.log("Data imported")
    process.exit()
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}

const destroyData = async () => {
  try {
    await User.deleteMany()
    await Product.deleteMany()
    await Order.deleteMany()

    console.log("Data destroyed")
    process.exit()
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}

if (process.argv[2] === "-d") {
  destroyData()
} else {
  importData()
}
