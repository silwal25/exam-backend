const router = require("express").Router()
const cors = require("cors")
const userController = require("./controllers/user")

// For cross origin requests
router.use(cors())

// root path
router.get("/", (req, res) => {
  res.send("App successfully connected!")
})

// All the users paths

router.get("/login", (req, res) => {
  res.send("Login page")
})

router.post("/register", userController.register)
router.post("/login", userController.login)
router.get("/verify-token", userController.verifyToken)

module.exports = router
