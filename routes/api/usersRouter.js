const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/userModel");
const { usersValidators } = require("../../utils");

const router = express.Router();

//registration==================
router.post("/register", async (req, res) => {
  try {
    // Validate request body
    const { error } = usersValidators.createRegistrationValidator(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Check if email is already in use
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(409).json({ message: "Email in use" });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    // Create a new user
    const newUser = new User({
      email: req.body.email,
      password: hashedPassword,
      subscription: "starter", // Default subscription
    });

    // Save the user to the database
    await newUser.save();

    // Respond with success
    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//loginization============================
router.post("/login", async (req, res) => {
  try {
    // Validate request body
    const { error } = usersValidators.createLoginizationValidator(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Find the user by email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!passwordMatch) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES,
    });

    // Save user token in obj
    user.token = token;

    // Respond with success
    res.status(200).json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
