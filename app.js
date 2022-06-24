// Importing the module into the app

const express = require("express")
const app = express()
const mongoose = require("mongoose")
const cors = require("cors")

// Initialize the application

const corsOptions = {
  exposedHeaders: "Authorization"
}
app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Express router for paths

app.use("/", require("./router"))

// Exporting app for database
module.exports = app
