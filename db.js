const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config()

// setting port from the environment variable
const port = process.env.PORT

// Connecting app to the database
// ! only run the server on successful connection to database
mongoose.connect(process.env.CONNECTION_STRING, (err, client) => {
  // ! if error, then print it
  if (err) {
    console.log(err)
  } else {
    // if connected successfully
    // import the app from file
    console.log("Successfully connected")
    module.exports = client
    const app = require("./app")
    app.listen(port, () => {
      console.log("backend started successfully")
    })
  }
})
