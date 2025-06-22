// controllers/reelController.js - Instagram Style Pagination
const Reel = require("../models/Reel");

exports.createReel = async (req, res) => {
  try {
    const { caption } = req.body;
    const videoUrl = req.file ? req.file.path : null;

    if (!videoUrl) {
      return res.status(400).json({ message: "Video file is required" });
    }

    const newReel = await Reel.create({
      caption,
      videoUrl,
      postedBy: req.user._id,
    });
    
    const populatedReel = await Reel.findById(newReel._id)
      .populate("postedBy", "username profilePicture");
    
    // Emit new reel event
    if (req.io) {
      req.io.emit("reelCreated", populatedReel);
    }
    
    res.status(201).json(populatedReel);
  } catch (err) {
    console.error("Error uploading reel:", err);
    res.status(500).json({ message: "Error uploading reel", err });
  }
};

// NEW: Instagram-style paginated reels
exports.getReelsFeed = async (req, res) => {
  try {
    const { page = 0, limit = 1 } = req.query; // Default: 1 reel per request
    const skip = parseInt(page) * parseInt(limit);

    const reels = await Reel.find()
      .populate("postedBy", "username profilePicture")
      .populate("comments.user", "username profilePicture")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for hasMore calculation
    const totalReels = await Reel.countDocuments();
    const hasMore = skip + parseInt(limit) < totalReels;

    res.status(200).json({
      reels,
      currentPage: parseInt(page),
      hasMore,
      totalReels
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching reels feed", err });
  }
};

// NEW: Get single reel with adjacent reel IDs for preloading
exports.getReelWithContext = async (req, res) => {
  try {
    if (req.params.id) {
      // Fetch by reel ID
      const reelId = req.params.id;

      // Find the reel by ID
      const currentReel = await Reel.findById(reelId)
        .populate("postedBy", "username profilePicture")
        .populate("comments.user", "username profilePicture");

      if (!currentReel) {
        return res.status(404).json({ message: "Reel not found" });
      }

      // Find the index of the current reel in sorted order
      const allReels = await Reel.find()
        .sort({ createdAt: -1 })
        .select('_id');

      const currentIndex = allReels.findIndex(r => r._id.toString() === reelId);

      if (currentIndex === -1) {
        return res.status(404).json({ message: "Reel not found in list" });
      }

      // Get next and previous reel IDs
      const nextReelId = allReels[currentIndex + 1]?._id || null;
      const prevReelId = currentIndex > 0 ? allReels[currentIndex - 1]?._id : null;

      // Get total count
      const totalReels = allReels.length;

      res.status(200).json({
        reel: currentReel,
        currentIndex,
        nextReelId,
        prevReelId,
        hasNext: currentIndex + 1 < totalReels,
        hasPrev: currentIndex > 0,
        totalReels
      });
    } else {
      // Fetch by index
      const { index = 0 } = req.query;
      const currentIndex = parseInt(index);

      // Get current reel
      const currentReel = await Reel.find()
        .populate("postedBy", "username profilePicture")
        .populate("comments.user", "username profilePicture")
        .sort({ createdAt: -1 })
        .skip(currentIndex)
        .limit(1);

      if (!currentReel.length) {
        return res.status(404).json({ message: "Reel not found" });
      }

      // Get next and previous reel IDs for preloading
      const nextReel = await Reel.find()
        .sort({ createdAt: -1 })
        .skip(currentIndex + 1)
        .limit(1)
        .select('_id');

      const prevReel = currentIndex > 0 ? await Reel.find()
        .sort({ createdAt: -1 })
        .skip(currentIndex - 1)
        .limit(1)
        .select('_id') : [];

      // Get total count
      const totalReels = await Reel.countDocuments();

      res.status(200).json({
        reel: currentReel[0],
        currentIndex,
        nextReelId: nextReel[0]?._id || null,
        prevReelId: prevReel[0]?._id || null,
        hasNext: currentIndex + 1 < totalReels,
        hasPrev: currentIndex > 0,
        totalReels
      });
    }
  } catch (err) {
    res.status(500).json({ message: "Error fetching reel with context", err });
  }
};

// MODIFIED: Keep original for backward compatibility
exports.getAllReels = async (req, res) => {
  try {
    const reels = await Reel.find()
      .populate("postedBy", "username profilePicture")
      .populate("comments.user", "username profilePicture")
      .sort({ createdAt: -1 });
    res.status(200).json(reels);
  } catch (err) {
    res.status(500).json({ message: "Error fetching reels", err });
  }
};

exports.getUserReels = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { page = 0, limit = 10 } = req.query;
    const skip = parseInt(page) * parseInt(limit);

    const reels = await Reel.find({ postedBy: userId })
      .populate("postedBy", "username profilePicture")
      .populate("comments.user", "username profilePicture")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalReels = await Reel.countDocuments({ postedBy: userId });
    const hasMore = skip + parseInt(limit) < totalReels;

    res.status(200).json({
      reels,
      currentPage: parseInt(page),
      hasMore,
      totalReels
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching user reels", err });
  }
};

exports.toggleLike = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    const userId = req.user._id;
    
    if (!reel) return res.status(404).json({ message: "Reel not found" });

    const alreadyLiked = reel.likes.includes(userId);
    if (alreadyLiked) {
      reel.likes.pull(userId);
    } else {
      reel.likes.push(userId);
    }

    await reel.save();
    
    // Emit like event
    req.io.emit("reelLiked", { reelId: req.params.id, userId });
    
    res.json({ 
      message: alreadyLiked ? "Reel unliked" : "Reel liked",
      likesCount: reel.likes.length,
      isLiked: !alreadyLiked
    });
  } catch (err) {
    res.status(500).json({ message: "Error toggling like", err });
  }
};

exports.commentOnReel = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (!reel) return res.status(404).json({ message: "Reel not found" });

    const comment = {
      user: req.user._id,
      text: req.body.text,
    };

    reel.comments.push(comment);
    await reel.save();
    
    // Populate the comment user before emitting
    const populatedReel = await Reel.findById(req.params.id)
      .populate("comments.user", "username profilePicture");
    const newComment = populatedReel.comments[populatedReel.comments.length - 1];
    
    // Emit comment event
    req.io.emit("reelCommented", { reelId: req.params.id, comment: newComment });
    
    res.json({ message: "Comment added", comment: newComment });
  } catch (err) {
    res.status(500).json({ message: "Error adding comment", err });
  }
};

exports.deleteReel = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (!reel) return res.status(404).json({ message: "Reel not found" });

    if (reel.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Reel.findByIdAndDelete(req.params.id);
    
    // Emit delete event
    req.io.emit("reelDeleted", req.params.id);
    
    res.json({ message: "Reel deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting reel", err });
  }
};

exports.getReelById = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id)
      .populate("postedBy", "username profilePicture")
      .populate("comments.user", "username profilePicture");
    if (!reel) {
      return res.status(404).json({ message: "Reel not found" });
    }
    res.status(200).json(reel);
  } catch (err) {
    res.status(500).json({ message: "Error fetching reel", err });
  }
};

// NEW: Preload specific reel by ID (for smooth transitions)
exports.preloadReel = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id)
      .populate("postedBy", "username profilePicture")
      .select('videoUrl caption postedBy likes comments createdAt'); // Minimal data for preloading

    if (!reel) {
      return res.status(404).json({ message: "Reel not found" });
    }

    res.status(200).json({
      id: reel._id,
      videoUrl: reel.videoUrl,
      caption: reel.caption,
      postedBy: reel.postedBy,
      likesCount: reel.likes.length,
      commentsCount: reel.comments.length
    });
  } catch (err) {
    res.status(500).json({ message: "Error preloading reel", err });
  }
};