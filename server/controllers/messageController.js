const Message = require("../models/Message");
const Chat = require("../models/Chat");

// Send a message
exports.sendMessage = async (req, res) => {
  try {
     const { chatId, text } = req.body;
    const newMsg = await Message.create({
      chatId,
      text,
      sender: req.user._id
    });
   // Update chat with lastMessage
    await Chat.findByIdAndUpdate(chatId, { lastMessage: newMsg._id });

    res.status(201).json(newMsg);

    // ⛔ DO NOT emit here. Use socket server (we'll write later)
  } catch (err) {
    res.status(500).json({ msg: "Error sending message", err });
  }
};

// Get all messages in a chat
exports.getChatMessages = async (req, res) => {
  try {
    const chatId = req.params.chatId;
    const messages = await Message.find({ chatId }).populate("sender", "username profilePicture");
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching messages", err });
  }
};