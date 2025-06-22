const mongoose = require("mongoose");
//searching fro all messages and sorting with time stamps vs we Simply find all chats where the user is a member
// Without Chat Model:
// Where would you store:

// Chat names ("Family Group")?

// Chat images?

// Notification settings (muted chats)?

// You'd have to duplicate this data in every message.
const messageSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  text: {
    type: String,
    required: true
  },
  seenBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }]
}, { timestamps: true });

module.exports = mongoose.model("Message", messageSchema);
