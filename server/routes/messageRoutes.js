const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const {
  sendMessage,
  getChatMessages
} = require("../controllers/messageController");

router.post("/", authMiddleware, sendMessage);              // send message
router.get("/:chatId", authMiddleware, getChatMessages);    // get all messages in chat

module.exports = router;
