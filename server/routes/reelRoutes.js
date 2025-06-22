// routes/reelRoutes.js - Updated for Instagram-style pagination
const express = require("express");
const router = express.Router();
const multer = require("multer");
const { authMiddleware } = require("../middleware/authMiddleware");
const {
  createReel,
  getAllReels,
  getReelsFeed,          // NEW: Paginated feed
  getReelWithContext,    // NEW: Single reel with context
  getUserReels,
  toggleLike,
  commentOnReel,
  deleteReel,
  getReelById,
  preloadReel            // NEW: Preload specific reel
} = require("../controllers/reelController");

// Configure multer storage for reels
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

// ============ REEL CRUD OPERATIONS ============
router.post("/", authMiddleware, upload.single("videoUrl"), createReel);
router.delete("/:id", authMiddleware, deleteReel);

// ============ INSTAGRAM-STYLE FEED ROUTES ============
// NEW: Get paginated feed (Instagram style)
router.get("/feed", authMiddleware, getReelsFeed);


// NEW: Get single reel with navigation context
router.get("/context", authMiddleware, getReelWithContext);
router.get("/contextById/:id", authMiddleware, getReelWithContext);

// NEW: Preload specific reel (for smooth transitions)
router.get("/preload/:id", authMiddleware, preloadReel);

// ============ INTERACTION ROUTES ============
router.put("/like/:id", authMiddleware, toggleLike);
router.post("/comment/:id", authMiddleware, commentOnReel);

// ============ INDIVIDUAL & USER REELS ============
router.get("/user/:userId", authMiddleware, getUserReels);
router.get("/:id", getReelById);

// ============ LEGACY ROUTE (for backward compatibility) ============
router.get("/", authMiddleware, getAllReels);

module.exports = router;