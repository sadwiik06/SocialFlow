const Chat = require("../models/Chat");
const Message = require("../models/Message");

// Create chat (if not exists)
exports.createChat = async (req, res) => {
  try {
    const userId = req.user._id;
    const receiverId = req.body.userId;
    let chat = await Chat.findOne({ members: { $all: [userId, receiverId] } });
    if (!chat) {
      chat = await Chat.create({ members: [userId, receiverId] });
        }

    res.status(200).json(chat);
  } catch (err) {
    res.status(500).json({ msg: "Error creating chat", err });
  }
};

exports.getUserChats = async (req, res) => {
  try {
    const chats = await Chat.find({ members: req.user._id })
      .populate("members", "username profilePicture")
      .populate("lastMessage");
    res.status(200).json(chats);
  } catch (err) {
    res.status(500).json({ msg: "Error getting chats", err });
  }
};