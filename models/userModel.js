const mongoose = require("mongoose")
const Joi = require("joi")
const bcrypt = require("bcryptjs")

// Constructor method for fetching the data from request object
let User = function (data) {
  this.data = data
  this.errors = []
}

// User schema for mongodb
const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    unique: true
  },
  email: {
    type: String,
    unique: true
  },
  password: String
})

// Joi schema for validation checks
const schema = Joi.object({
  userName: Joi.string().min(6).max(20).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
})

// Mongoose model
const userModel = mongoose.model("User", userSchema)

// Register function
// * Returns a promise that is resolved when
// * the user is registered
User.prototype.register = function () {
  return new Promise(async (resolve, reject) => {
    // If the user is already registered
    // reject
    try {
      const user = await userModel.findOne({ userName: this.data.userName })
      if (user) {
        // User found in the database
        // reject
        reject("user already registered")
      } else {
        // User not found
        // Proceed with the validation checks
        // After validating, save to the database
        const { error } = schema.validate(this.data)

        // If there is any validation errors
        // then reject
        // else insert the data into the database
        if (error) {
          reject(error.details[0].message)
        } else {
          // Hashing password
          const salt = bcrypt.genSaltSync(10)
          const hashPassword = await bcrypt.hash(this.data.password, salt)
          const newUser = new userModel({
            userName: this.data.userName,
            email: this.data.email,
            password: hashPassword
          })

          console.log("here")
          await newUser
            .save()
            .then(() => {
              resolve("User saved successfully")
            })
            .catch((e) => {
              reject("There was an error saving \n" + e.message)
            })
        }
      }
    } catch (err) {
      // Some unexpected error while fetching the user
      reject(err)
    }
  })
}

// Login function
User.prototype.login = function () {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await userModel.findOne({ userName: this.data.userName })
      if (user) {
        // User found in the database
        // Check for the password with the hash
        if (bcrypt.compareSync(this.data.password, user.password)) {
          // Password matched, resolve with the user id and username
          resolve(user._id, user.userName)
        } else {
          // Password not matched, reject
          reject("Password does not matched")
        }
      } else {
        // User not found
        reject("User not found")
      }
    } catch (err) {
      // Some unexpected error
      reject(err)
    }
  })
}

module.exports = User
