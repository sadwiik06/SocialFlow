import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Form,
  ListGroup,
  Image,
  Spinner,
  Alert,
  Modal,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import axios from "axios";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  Smile,
} from "lucide-react";
import { getSocket } from "../utils/socket";
import "../css/Post.css";

const Post = ({ post, onDelete, user }) => {
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [isDoubleTapped, setIsDoubleTapped] = useState(false);
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Local state for likes and comments
  const [isLiked, setIsLiked] = useState(post.likes.includes(user?._id));
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [comments, setComments] = useState(
    Array.isArray(post.comments) ? post.comments : []
  );

  // Removed syncing local state with props to avoid conflicts with socket updates
  // useEffect(() => {
  //   console.log('Post.jsx useEffect - post.likes:', post.likes);
  //   console.log('Post.jsx useEffect - isLiked before set:', post.likes.includes(user?._id));
  //   setIsLiked(post.likes.includes(user?._id));
  //   setLikeCount(post.likes.length);
  //   setComments(post.comments);
  // }, [post.likes, post.comments, user?._id]);

  // Socket event listeners for real-time updates
  useEffect(() => {
    const socket = getSocket();

    // Listen for like updates on this specific post
    const handleLikeUpdate = (data) => {
      if (data.postId === post._id) {
        const likesArray = Array.isArray(data.likes) ? data.likes : [];
        // Ignore updates from current user to avoid blinking
        if (user?._id && likesArray.includes(user._id) === isLiked) {
          return;
        }
        setIsLiked(likesArray.includes(user?._id));
        setLikeCount(likesArray.length);
      }
    };

    // Listen for comment updates on this specific post
    const handleCommentUpdate = (data) => {
      if (data.postId === post._id) {
        setComments(data.comments);
      }
    };

    // Register event listeners
    socket.on("postLiked", handleLikeUpdate);
    socket.on("postCommented", handleCommentUpdate);

    // Cleanup listeners on unmount
    return () => {
      socket.off("postLiked", handleLikeUpdate);
      socket.off("postCommented", handleCommentUpdate);
    };
  }, [post._id, user?._id]);

  const handleLike = async () => {
    if (loading) return; // prevent multiple clicks
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/posts/like/${post._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update local state immediately for better UX
      const updatedPost = response.data.post;
      console.log("handleLike: updating local state", updatedPost.likes);
      setIsLiked(updatedPost.likes.includes(user?._id));
      setLikeCount(updatedPost.likes.length);

      // Emit socket event for other clients
      const socket = getSocket();
      socket.emit("likePost", {
        postId: post._id,
        userId: user._id,
        likes: updatedPost.likes,
      });

      // Add like animation
      if (updatedPost.likes.includes(user?._id)) {
        setShowLikeAnimation(true);
        setTimeout(() => setShowLikeAnimation(false), 1000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error liking post");
    } finally {
      setLoading(false);
    }
  };

  const handleDoubleClick = () => {
    if (!isLiked) {
      handleLike();
    }
    setIsDoubleTapped(true);
    setTimeout(() => setIsDoubleTapped(false), 1000);
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/posts/comment/${post._id}`,
        { text: newComment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Open the modal to view all comments if not already open
      setShowCommentsModal(true);
      // Update local state immediately
      const updatedPost = response.data.post;
      setComments(updatedPost.comments);

      // Emit socket event for other clients
      const socket = getSocket();
      socket.emit("commentPost", {
        postId: post._id,
        userId: user._id,
        comments: updatedPost.comments,
      });

      setNewComment("");
    } catch (err) {
      setError(err.response?.data?.message || "Error adding comment");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleComment(e);
    }
  };

  const formatTimeAgo = () => {
    // In real app, calculate from post.createdAt
    const postDate = new Date(post.createdAt || new Date());
    const now = new Date();
    const diffInSeconds = Math.floor((now - postDate) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  return (
    <React.Fragment>
      <Card className="mb-4 post-card">
        <Card.Header className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <Image
              src={
              (post.postedBy.profilePicture &&
                  (post.postedBy.profilePicture.startsWith("http")
                    ? post.postedBy.profilePicture
                    : `${import.meta.env.VITE_BASE_URL}/${post.postedBy.profilePicture}`)) ||
                "/default-profile.png"
              }
              roundedCircle
              className="post-profile-pic me-2"
              style={{ width: "32px", height: "32px", objectFit: "cover" }}
              alt={`${post.postedBy.username}'s profile`}
            />
            <span className="fw-bold">{post.postedBy.username}</span>
          </div>
        </Card.Header>

        <div className="post-image-container position-relative">
          <img
            src={
              post.imageUrl
                ? `${import.meta.env.VITE_BASE_URL}/${post.imageUrl.replace(/\\\\/g, "/")}`
                : ""
            }
            alt="Post"
            className="post-image w-100"
            onDoubleClick={handleDoubleClick}
            style={{ cursor: "pointer" }}
          />

          {/* Double tap heart animation */}
          {isDoubleTapped && (
            <div
              className="position-absolute top-50 start-50 translate-middle"
              style={{ pointerEvents: "none" }}
            >
              <Heart
                size={80}
                className={`text-white fill-white animate-ping ${
                  isDoubleTapped ? "opacity-80" : "opacity-0"
                }`}
                style={{ transition: "opacity 1s" }}
              />
            </div>
          )}

          {/* Like animation */}
          {showLikeAnimation && (
            <div
              className="position-absolute top-0 start-0 m-3"
              style={{ pointerEvents: "none" }}
            >
              <div className="d-flex align-items-center bg-dark bg-opacity-60 text-white px-2 py-1 rounded-pill animate-bounce">
                <Heart size={16} className="fill-white text-white me-1" />
                <span>+1</span>
              </div>
            </div>
          )}
        </div>

        <Card.Body>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div className="d-flex align-items-center">
              <Button variant="link" className="p-0 me-3" onClick={handleLike}>
                <Heart
                  size={26}
                  className={`${
                    isLiked ? "fill-danger text-danger" : "text-dark"
                  }`}
                  style={{ transition: "all 0.2s" }}
                />
              </Button>
              <Button
                variant="link"
                className="p-0 me-3"
                onClick={() => setShowCommentsModal(true)}
              >
                <MessageCircle size={26} className="text-dark" />
              </Button>
              <Button
                variant="link"
                className="p-0 me-3"
                onClick={() => {
                  if (navigator.clipboard) {
                    const postLink = `${window.location.origin}/posts/${post._id}`;
                    navigator.clipboard
                      .writeText(postLink)
                      .then(() => {
                        setToastMessage("Post link copied to clipboard!");
                        setShowToast(true);
                      })
                      .catch(() => {
                        setToastMessage("Failed to copy post link.");
                        setShowToast(true);
                      });
                  } else {
                    setToastMessage("Clipboard API not supported.");
                    setShowToast(true);
                  }
                }}
              >
                <Send size={26} className="text-dark" />
              </Button>
            </div>
          </div>

          <div className="mb-2">
            <span className="fw-bold">{likeCount.toLocaleString()} likes</span>
          </div>

          <Card.Text className="mb-2">
            <span className="fw-bold me-2">{post.postedBy.username}</span>
            {post.caption}
          </Card.Text>

          {Array.isArray(comments) && comments.length > 0 && (
            <ListGroup variant="flush" className="mb-3">
              {!showCommentsModal && comments.length > 2 && (
                <ListGroup.Item className="px-0 py-1">
                  <Button
                    variant="link"
                    className="p-0 text-muted small"
                    onClick={() => setShowCommentsModal(true)}
                  >
                    View all {comments.length} comments
                  </Button>
                </ListGroup.Item>
              )}

              {(showCommentsModal
                ? comments || []
                : (comments || []).slice(-2) || []
              ).map((comment) => (
                <ListGroup.Item key={comment._id} className="px-0 py-1">
                  <div className="d-flex align-items-start">
                    <Image
src={
  comment?.user?.profilePicture
    ? comment.user.profilePicture.startsWith("http")
      ? comment.user.profilePicture
      : `${import.meta.env.VITE_BASE_URL}/${comment.user.profilePicture.replace(
          /\\\\/g,
          "/"
        )}`
    : "/default-profile.png"
}
                      roundedCircle
                      width={32}
                      height={32}
                      className="me-2"
                      alt={`${comment.user?.username}'s profile`}
                    />
                    <div className="flex-grow-1">
                      <span className="fw-bold me-2">
                        {comment?.user?.username}
                      </span>
                      {comment.text}
                    </div>
                    <Button
                      variant="link"
                      className="p-0 opacity-0 hover-opacity-100"
                      style={{ transition: "opacity 0.2s" }}
                    >
                      <Heart size={14} className="text-muted" />
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
          <div className="text-muted small text-uppercase mb-3">
            {formatTimeAgo()}
          </div>
          <Form onSubmit={handleComment} className="border-top pt-3">
            <div className="d-flex align-items-center">
              <Button variant="link" className="p-0 me-2">
                <Smile size={20} className="text-muted" />
              </Button>
              <Form.Control
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-grow-1 me-2"
                style={{ border: "none", boxShadow: "none" }}
              />
              {newComment.trim() && (
                <Button
                  variant="link"
                  type="submit"
                  disabled={loading}
                  className="text-primary fw-bold p-0"
                >
                  {loading ? <Spinner size="sm" /> : "Post"}
                </Button>
              )}
            </div>
          </Form>

          {error && <Alert variant="danger">{error}</Alert>}
        </Card.Body>

        <Modal
          show={showCommentsModal}
          onHide={() => setShowCommentsModal(false)}
          centered
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Comments</Modal.Title>
          </Modal.Header>
          <Modal.Body
            style={{
              maxHeight: "60vh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Form onSubmit={handleComment} className="border-bottom pb-3 mb-3">
              <div className="d-flex align-items-center">
                <Button variant="link" className="p-0 me-2">
                  <Smile size={20} className="text-muted" />
                </Button>
                <Form.Control
                  type="text"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-grow-1 me-2"
                  style={{ border: "none", boxShadow: "none" }}
                />
                {newComment.trim() && (
                  <Button
                    variant="link"
                    type="submit"
                    disabled={loading}
                    className="text-primary fw-bold p-0"
                  >
                    {loading ? <Spinner size="sm" /> : "Post"}
                  </Button>
                )}
              </div>
            </Form>
            <div
              style={{
                overflowY: "auto",
                flexGrow: 1,
                maxHeight: "calc(60vh - 70px)",
              }}
            >
              <ListGroup variant="flush">
                {(Array.isArray(comments)
                  ? comments.slice().reverse()
                  : []
                ).map((comment) => (
                  <ListGroup.Item key={comment._id} className="px-0 py-1">
                    <div className="d-flex align-items-start">
                      <Image
                        src={
                          comment.user?.profilePicture
                            ? comment.user.profilePicture.startsWith("http")
                              ? comment.user.profilePicture
                              : `${import.meta.env.VITE_BASE_URL}/${comment.user.profilePicture.replace(
                                  /\\\\/g,
                                  "/"
                                )}`
                            : "/default-profile.png"
                        }
                        roundedCircle
                        width={32}
                        height={32}
                        className="me-2"
                        alt={`${comment.user?.username}'s profile`}
                      />
                      <div className="flex-grow-1">
                        <span className="fw-bold me-2">
                          {comment.user?.username}
                        </span>
                        {comment.text}
                      </div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          </Modal.Body>
        </Modal>

        {user?._id === post.postedBy._id && (
          <Card.Footer className="text-end">
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => onDelete(post._id)}
            >
              Delete
            </Button>
          </Card.Footer>
        )}
      </Card>

      {/* Toast for copy link feedback */}
      <ToastContainer position="bottom-center" className="mb-3">
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={2000}
          autohide
          bg="success"
        >
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </React.Fragment>
  );
};

export default Post;
