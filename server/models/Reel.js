const mongoose = require("mongoose");

const reelSchema = new mongoose.Schema({
  caption: {
    type: String,
    maxlength: 300
  },
  videoUrl: {
    type: String,
    required: true
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    text: {
      type: String,
      maxlength: 150
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, { timestamps: true });

module.exports = mongoose.model("Reel", reelSchema);
