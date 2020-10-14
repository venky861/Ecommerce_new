import jwt from "jsonwebtoken"

const generateToken = (id) => {
  console.log("id", id)
  return jwt.sign({ id }, process.env.JWT_TOKEN, { expiresIn: "30d" })
}

export default generateToken
