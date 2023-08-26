const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../models/user");
const secretKey = process.env.SECRET_KEY;

// Sign-up route
router.post("/signup", async (req, res) => {
  const { name, password } = req.body;

  try {
    const existingUser = await User.findOne({ name });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "User created" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred" });
  }
});

// Sign-in route
router.post("/signin", async (req, res) => {
  const { name, password } = req.body;

  try {
    const user = await User.findOne({ name });
    if (!user) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    const token = jwt.sign({ userId: user._id }, secretKey, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Authentication successful", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred" });
  }
});

module.exports = router;
