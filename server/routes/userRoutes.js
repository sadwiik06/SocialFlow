const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const multer = require("multer");
const {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  getFollowersCount,
  getFollowingCount,
  updateProfile,
  searchUsers,
  getUserById,
  getSuggestedUsers,
  getProfile
} = require("../controllers/userController");

// Configure multer storage for profile pictures
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  }
});
const upload = multer({ storage });

// 🔐 Requires login for follow actions
router.post("/follow/:id", authMiddleware, followUser);
router.post("/unfollow/:id", authMiddleware, unfollowUser);

// ✅ Public routes to fetch info
router.get("/followers/:id", getFollowers);
router.get("/following/:id", getFollowing);
router.get("/followers-count/:id", getFollowersCount);
router.get("/following-count/:id", getFollowingCount);
router.put("/update", authMiddleware, upload.single("profilePicture"), updateProfile);

router.get("/search", authMiddleware, searchUsers);
router.get("/suggested", authMiddleware, getSuggestedUsers);

router.get("/profile", authMiddleware, getProfile);
router.get("/:id", authMiddleware, getUserById);

module.exports = router;
