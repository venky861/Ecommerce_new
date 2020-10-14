import mongoose from "mongoose"

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
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

export default connectDB
