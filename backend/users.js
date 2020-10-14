import bcrypt from "bcryptjs"

const users = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: true,
  },
  {
    name: "Venky ",
    email: "venky@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
  {
    name: "Subha",
    email: "subha@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
]

export default users
