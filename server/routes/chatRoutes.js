const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const {
  createChat,
  getUserChats
} = require("../controllers/chatController");

router.post("/", authMiddleware, createChat);           // create or reuse chat
router.get("/", authMiddleware, getUserChats);          // get all chats of user

module.exports = router;
