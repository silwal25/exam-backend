const User = require("../models/userModel")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
dotenv.config()

exports.register = (req, res) => {
  let user = new User(req.body)

  // First check if the user is already registered
  // If not, register them
  user
    .register()
    .then((data) => {
      // User is not already registered
      // Create a new user and add it to the database
      res.send({ message: "Successfully registered", status: 200 })
    })
    .catch((err) => {
      // User is already registered
      res.send({ message: "User is already registered", status: 400, err })
    })
}

exports.login = (req, res, next) => {
  let user = new User(req.body)

  // First check if the user is already registered
  // If not then return an error
  user
    .login()
    .then((id, name) => {
      // User is already registered
      // Create a new jwt token and login
      const token = jwt.sign({ id: id }, process.env.JWT_SECRET)
      res.send({ auth_token: token, status: 200, name: name, message: "successfully logged in" })
    })
    .catch((err) => {
      // User does not exist or
      // Invalid credentials
      res.send({ message: err })
    })
}

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        res.sendStatus(401)
      } else {
        res.sendStatus(200)
      }
    })
  } else {
    return res.send(err)
  }
}
