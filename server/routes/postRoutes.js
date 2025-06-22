// routes/postRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const { authMiddleware } = require("../middleware/authMiddleware");
const { 
  createPost, 
  getAllPosts, 
  getUserPosts, 
  toggleLike, 
  commentOnPost, 
  deletePost ,
  getPostById
} = require("../controllers/postController");

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Ensure this folder exists or create it
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  }
});
const upload = multer({ storage: storage });

router.post("/", authMiddleware, upload.single("imageUrl"), createPost);
router.get("/", authMiddleware, getAllPosts);
router.get("/user/:userId", authMiddleware, getUserPosts);
router.put("/like/:postId", authMiddleware, toggleLike);
router.post("/comment/:postId", authMiddleware, commentOnPost);
router.delete("/:id", authMiddleware, deletePost);

router.get("/:id", authMiddleware, getPostById);

module.exports = router;
