const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register User
exports.register = async (req, res) => {
  try {
    console.log("Registration attempt received:", req.body);
    const { username, email, password, gender } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      console.log("Registration failed: User already exists", { email, username });
      return res.status(400).json({ msg: "Username or email already exists." });
    }

    console.log("Creating new user instance...");
    const user = new User({ username, email, password, gender });

    console.log("Saving user to database...");
    await user.save();
    console.log("User saved successfully:", user._id);

    console.log("Generating token...");
    const token = user.generateToken();

    const { password: _, ...userData } = user._doc;

    console.log("Registration successful for:", username);
    res.status(201).json({ token, user: userData });
  } catch (error) {
    console.error("CRITICAL REGISTRATION ERROR:", error);

    // Handle Mongoose Validation Errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ msg: messages[0], details: messages });
    }

    res.status(500).json({ msg: "Server error", error: error.message || error });
  }
};


// Login User
exports.login = async (req, res) => {
  try {
    console.log("Login attempt received:", req.body.emailOrUsername);
    const { emailOrUsername, password } = req.body;

    // Find user by email or username
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    }).select("+password");

    if (!user) {
      console.log("Login failed: User not found", emailOrUsername);
      return res.status(400).json({ msg: "Invalid credentials." });
    }

    console.log("User found, comparing passwords...");
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Login failed: Password mismatch for", emailOrUsername);
      return res.status(401).json({ msg: "Invalid credentials." });
    }

    console.log("Generating token...");
    const token = user.generateToken();
    const { password: _, ...userData } = user._doc;

    console.log("Login successful for:", emailOrUsername);
    res.status(200).json({ token, user: userData });
  } catch (error) {
    console.error("CRITICAL LOGIN ERROR:", error);
    res.status(500).json({ msg: "Login failed", error: error.message || error });
  }
};


// Get profile (optional)
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ msg: "Could not fetch profile" });
  }
};
