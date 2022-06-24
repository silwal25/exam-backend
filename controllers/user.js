const User = require("../models/userModel")
const jwt = require("jsonwebtoken")

exports.register = (req, res) => {
  let user = new User(req.body)

  // First check if the user is already registered
  // If not, register them
  user
    .register()
    .then((data) => {
      // User is not already registered
      // Create a new user and add it to the database
      res.send("Successfully registered")
    })
    .catch((err) => {
      // User is already registered
      console.log(err)
      res.send(err)
    })
}

exports.login = (req, res, next) => {
  let user = new User(req.body)

  // First check if the user is already registered
  // If not then return an error
  user
    .login()
    .then((id) => {
      // User is already registered
      // Create a new jwt token and login
      const token = jwt.sign({ _id: id }, "123456")
      res.send({ auth_token: token })
    })
    .catch((err) => {
      // User does not exist or
      // Invalid credentials
      res.send(err)
    })
}

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]
  if (token) {
    jwt.verify(token, "123456", (err, user) => {
      if (err) {
        res.sendStatus(401)
      } else {
        res.sendStatus(200)
      }
    })
  } else {
    return res.sendStatus(401)
  }
}
