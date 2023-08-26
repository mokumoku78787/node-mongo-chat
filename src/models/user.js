const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Ensures name is unique
    minlength: 4, // Enforces minimum length of 4 characters
    validate: {
      validator: function (value) {
        // Custom validator to check if the name contains only ASCII characters
        return /^[\x00-\x7F]*$/.test(value);
      },
      message: "Name should only contain ASCII characters",
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8, // Enforces minimum length of 8 characters for better security
    validate: {
      validator: function (value) {
        // Custom validator to check if the password contains only ASCII characters
        return /^[\x00-\x7F]*$/.test(value);
      },
      message: "Password should only contain ASCII characters",
    },
  },
});

module.exports = mongoose.model("User", UserSchema);
