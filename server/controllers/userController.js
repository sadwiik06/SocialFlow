const User = require("../models/User");
exports.followUser = async (req, res) => {
  try {
    const user = req.user._id;
    const target = req.params.id;
    if (user == target)
      return res.status(400).json({ msg: "You can't follow yourself" });
    const usertf = await User.findOne({ _id: target });
    if (!usertf) return res.status(404).json({ msg: "User not found" });
    const currentUser = await User.findById(user);
    usertf.followers.push(user);
    await usertf.save();
    currentUser.following.push(target);
    await currentUser.save();
    res.json({ msg: "User followed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error" });
  }
};
exports.unfollowUser = async (req, res) => {
  try {
    const user = req.user._id;
    const target = req.params.id;
    if (user == target)
      return res.status(400).json({ msg: "You can't follow yourself" });
    const usertf = await User.findOne({ _id: target });
    if (!usertf) return res.status(404).json({ msg: "User not found" });
    const currentUser = await User.findById(user);
    usertf.followers.pull(user);
    await usertf.save();
    currentUser.following.pull(target);
    await currentUser.save();
    res.json({ msg: "User unfollowed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error" });
  }
};
exports.getFollowersCount = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ msg: "User not found" });
  res.json({ count: user.followers.length });
};
exports.getFollowingCount = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ msg: "User not found" });
  res.json({ count: user.following.length });
};
exports.getFollowers = async (req, res) => {
  const user = await User.findById(req.params.id).populate(
    "followers",
    "username profilePicture"
  );
  if (!user) return res.status(404).json({ msg: "User not found" });
  res.json({ followers: user.followers });
};
exports.getFollowing = async (req, res) => {
  const user = await User.findById(req.params.id).populate(
    "following",
    "username profilePicture"
  );
  if (!user) return res.status(404).json({ msg: "User not found" });
  res.json({ following: user.following });
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const updates = {};

    if (req.body.username) updates.username = req.body.username;
    if (req.body.bio) updates.bio = req.body.bio;
    if (req.body.gender) updates.gender = req.body.gender;
    if (req.file) {
      updates.profilePicture = req.file.path;
    } else if (req.body.profilePicture) {
      updates.profilePicture = req.body.profilePicture;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error updating profile", err });
  }
};
exports.searchUsers = async (req, res) => {
  try {
    const query = req.query.q;
    const users = await User.find({
      username: { $regex: query, $options: "i" } // case-insensitive
    }).select("username profilePicture _id");

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ msg: "Error searching users", err });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("followers", "username profilePicture _id")
      .populate("following", "username profilePicture _id");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching user", err });
  }
};
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching profile", err });
  }
};

exports.getSuggestedUsers = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    // Get current user’s following list
    const currentUser = await User.findById(currentUserId);

    // Exclude current user and those he already follows
    const excludedUsers = [...currentUser.following, currentUserId];

    const suggestions = await User.find({ _id: { $nin: excludedUsers } })
      .select("username profilePicture _id")
      .limit(5); // you can randomize later too

    res.json(suggestions);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching suggestions", err });
  }
};
