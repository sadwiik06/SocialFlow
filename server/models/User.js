const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
      match: /^[a-zA-Z0-9_]+$/, // Alphanumeric + underscores
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // Never return password in queries
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    profilePicture: {
      type: String,
      default: "default_profile.jpg",
    },
    bio: {
      type: String,
      maxlength: 150,
      default: "",
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    savedItems: [
      {
        itemType: {
          type: String,
          enum: ["Post", "Reel"],
        },
        itemId: {
          type: mongoose.Schema.Types.ObjectId,
          refPath: "savedItems.itemType",
        },
      },
    ],
    lastActive: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);
UserSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hash_password = await bcrypt.hash(user.password, salt);
    user.password = hash_password;
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.methods.generateToken = function () {
  try {
    return jwt.sign(
      {
        _id: this._id,
        email: this.email,
        username: this.username,
      },
      process.env.secret_key,
      {
        expiresIn: "1h",
      }
    );
  } catch (err) {
    return err;
  }
};
module.exports = mongoose.model("User", UserSchema);
