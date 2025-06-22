const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register User
exports.register = async (req, res) => {
  try {
    const { username, email, password} = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ msg: "Username or email already exists." });
    }

    const user = new User({ username, email, password});
    await user.save();

    const token = user.generateToken();
    const { password: _, ...userData } = user._doc;

    res.status(201).json({ token, user: userData });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    // Find user by email or username
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    }).select("+password");

    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid credentials." });
    }

    const token = user.generateToken();
    const { password: _, ...userData } = user._doc;

    res.status(200).json({ token, user: userData });
  } catch (error) {
    res.status(500).json({ msg: "Login failed", error });
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
