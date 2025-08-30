// server.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const path = require('path');
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const reelRoutes = require("./routes/reelRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");

require("dotenv").config();

const app = express();

const corsOptions = {
  origin: "https://thesocialflow.onrender.com",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Middleware to attach io to req
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Serve static files from uploads folder
app.use('/uploads', express.static('uploads'));

app.get("/", (req, res) => {
  res.send("Hello from Express with CORS!");
});
app.use(express.static(path.join(__dirname, 'public')));
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/reels", reelRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://thesocialflow.onrender.com",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Socket.IO events
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join user to their own room for notifications
  socket.on("joinUser", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  // Chat events
  socket.on("joinChat", (chatId) => {
    socket.join(chatId);
    console.log(`User joined chat: ${chatId}`);
  });

  socket.on("sendMessage", (message) => {
    socket.to(message.chatId).emit("newMessage", message);
  });

  // Post events
  socket.on("likePost", (postId, userId) => {
    io.emit("postLiked", { postId, userId });
  });

  socket.on("commentPost", (postId, comment) => {
    io.emit("postCommented", { postId, comment });
  });

  socket.on("newPost", (post) => {
    io.emit("postCreated", post);
  });

  // Reel events
  socket.on("likeReel", (reelId, userId) => {
    io.emit("reelLiked", { reelId, userId });
  });

  socket.on("commentReel", (reelId, comment) => {
    io.emit("reelCommented", { reelId, comment });
  });

  socket.on("newReel", (reel) => {
    io.emit("reelCreated", reel);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
app.get("/health", async (req, res) => {
  try {
   
    const dbState = mongoose.connection.readyState; 
    if (dbState === 1) {
      res.status(200).json({ status: "OK", message: "Server and DB are running" });
    } else {
      res.status(500).json({ status: "ERROR", message: "DB not connected" });
    }
  } catch (err) {
    res.status(500).json({ status: "ERROR", message: "Health check failed", error: err });
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error:", err));
