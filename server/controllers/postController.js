// controllers/postController.js
const Post = require("../models/Post");
const User = require("../models/User");

exports.createPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const imageUrl = req.file ? req.file.path : null;

    if (!imageUrl) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const newPost = await Post.create({
      caption,
      imageUrl,
      postedBy: req.user._id
    });
    
    const populatedPost = await Post.findById(newPost._id)
      .populate("postedBy", "username profilePicture");
    
    // Emit new post event
    req.io.emit("postCreated", populatedPost);
    
    res.status(201).json(populatedPost);
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ message: "Error creating post", err });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("postedBy", "username profilePicture")
      .populate("comments.user", "username profilePicture")
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching posts", err });
  }
};

exports.getUserPosts = async (req, res) => {
  try {
    const userId = req.params.userId;
    const posts = await Post.find({ postedBy: userId })
      .populate("postedBy", "username profilePicture")
      .populate("comments.user", "username profilePicture")
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user posts", err });
  }
};

exports.toggleLike = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    const userId = req.user._id;
    
    if (!post) return res.status(404).json({ message: "Post not found" });
    
    const alreadyLiked = post.likes.includes(userId);
    if (alreadyLiked) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }
    
    await post.save();
    
    // Emit like event with updated post including populated likes
    const updatedPost = await Post.findById(postId)
      .populate("postedBy", "username profilePicture")
      .populate("comments.user", "username profilePicture");
    req.io.emit("postLiked", { postId, userId, likes: updatedPost.likes, post: updatedPost });
    
    res.json({ 
      message: alreadyLiked ? "Post unliked" : "Post liked",
      likesCount: post.likes.length,
      post: updatedPost
    });
  } catch (err) {
    res.status(500).json({ message: "Error toggling like", err });
  }
};

exports.commentOnPost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    const userId = req.user._id;
    
    if (!post) return res.status(404).json({ message: "Post not found" });
    
    const comment = {
      text: req.body.text,
      user: userId
    };
    
    post.comments.push(comment);
    await post.save();
    
    // Populate the comment user before emitting
    const populatedPost = await Post.findById(postId)
      .populate("comments.user", "username profilePicture");
    const newComment = populatedPost.comments[populatedPost.comments.length - 1];
    
    // Emit comment event
    req.io.emit("postCommented", { postId, comment: newComment });
    
    // Respond with full populated post for client update
    res.json({ message: "Comment added", post: populatedPost });
  } catch (err) {
    res.status(500).json({ message: "Error adding comment", err });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Post.findByIdAndDelete(req.params.id);
    
    // Emit delete event
    req.io.emit("postDeleted", req.params.id);
    
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting post", err });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId)
      .populate("postedBy", "username profilePicture")
      .populate("comments.user", "username profilePicture");
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: "Error fetching post", err });
  }
};
