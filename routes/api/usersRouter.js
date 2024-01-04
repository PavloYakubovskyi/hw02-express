const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../../models/userModel");
const { registrationValidators } = require("../../utils");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    // Validate request body
    const { error } = registrationValidators.createRegistrationValidator(
      req.body
    );
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

module.exports = router;
