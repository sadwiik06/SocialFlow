const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  caption: {
    type: String,
    maxlength: 300
  },
  imageUrl: {
    type: String,
    required: false
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

module.exports = mongoose.model("Post", postSchema);
