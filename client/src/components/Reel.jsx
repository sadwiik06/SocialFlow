import { useState, useEffect, useRef } from 'react';
import { Heart, MessageCircle, Send, Volume2, VolumeX } from 'lucide-react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { initSocket } from '../utils/socket';
import '../css/Reel.css';

const Reel = ({ reel: propReel, onDelete, user, isActive }) => {
  const { id } = useParams();
  const videoRef = useRef(null);
  const [reel, setReel] = useState(propReel || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!propReel && id) {
      const fetchReel = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/reels/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setReel(response.data);
          setIsLiked(response.data.likes.includes(user?._id));
          setLikeCount(response.data.likes.length);
          setComments(response.data.comments);
        } catch (err) {
          setError(err.response?.data?.message || 'Error fetching reel');
        }
      };
      fetchReel();
    } else if (propReel) {
      setReel(propReel);
      setIsLiked(propReel.likes.includes(user?._id));
      setLikeCount(propReel.likes.length);
      setComments(propReel.comments);
    }
  }, [id, propReel, user?._id]);

  useEffect(() => {
    if (!reel) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    const socket = initSocket(token);

    socket.on('reelLiked', ({ reelId, userId }) => {
      if (reelId === reel._id) {
        if (userId === user?._id) {
          setIsLiked(prevIsLiked => !prevIsLiked);
          setLikeCount(prev => prev + (isLiked ? -1 : 1));
        } else {
          setLikeCount(prev => prev + 1);
        }
      }
    });

    socket.on('reelCommented', ({ reelId, comment }) => {
      if (reelId === reel._id) {
        setComments(prev => [...prev, comment]);
      }
    });

    socket.on('reelDeleted', ({ reelId }) => {
      if (reelId === reel._id && onDelete) {
        onDelete(reelId);
      }
    });

    return () => {
      socket.off('reelLiked');
      socket.off('reelCommented');
      socket.off('reelDeleted');
    };
  }, [reel, isLiked, user?._id, onDelete]);

  // Handle Play/Pause based on isActive prop
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      video.play().then(() => setIsPlaying(true)).catch(e => console.log("Play error:", e));
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, [isActive]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    const handleEnded = () => {
      video.currentTime = 0;
      video.play();
    };

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('ended', handleEnded);
    };
  }, [reel]);

  const lastTapRef = useRef(0);

  const handleVideoClick = () => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;

    if (lastTapRef.current && (now - lastTapRef.current) < DOUBLE_PRESS_DELAY) {
      handleLike();
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = now;
      setTimeout(() => {
        if (lastTapRef.current === now) {
          const video = videoRef.current;
          if (video) {
            if (video.paused) {
              video.play();
              setIsPlaying(true);
            } else {
              video.pause();
              setIsPlaying(false);
            }
          }
          lastTapRef.current = 0;
        }
      }, DOUBLE_PRESS_DELAY);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleLike = async () => {
    if (!reel) return;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/reels/like/${reel._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsLiked(response.data.isLiked);
      setLikeCount(response.data.likesCount);
    } catch (err) {
      setError(err.response?.data?.message || 'Error liking reel');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !reel) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/reels/comment/${reel._id}`,
        { text: newComment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNewComment('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding comment');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const reelUrl = `${window.location.origin}/reels/${reel._id}`;
    try {
      await navigator.clipboard.writeText(reelUrl);
      // Show a temporary success message
      const originalError = error;
      setError('Link copied to clipboard!');
      setTimeout(() => setError(originalError), 2000);
    } catch {
      setError('Failed to copy link');
      setTimeout(() => setError(''), 2000);
    }
  };

  if (!reel) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div className="reel-container">
      <div className="reel-content">
        <div className="reel-video-wrapper">
          {reel.videoUrl ? (
            <video
              ref={videoRef}
              className="reel-video"
              loop
              muted={isMuted}
              playsInline
              onClick={handleVideoClick}
              src={reel.videoUrl.startsWith('http') ? reel.videoUrl : `${import.meta.env.VITE_BASE_URL}/${reel.videoUrl.replace(/\\\\/g, '/')}`}
            />
          ) : (
            <div className="no-video-placeholder">No video available</div>
          )}

          {/* Progress Bar */}
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>

          {/* Top Controls */}
          <div className="top-controls">
            <button className="control-btn" onClick={toggleMute}>
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          </div>

          {/* Bottom Info */}
          <div className="bottom-info">
            <div className="user-info">
              <img
                src={reel.postedBy.profilePicture && (reel.postedBy.profilePicture.startsWith('http') ? reel.postedBy.profilePicture : `${import.meta.env.VITE_BASE_URL}/${reel.postedBy.profilePicture}`) || '/default-profile.png'}
                alt={reel.postedBy.username}
                className="bottom-profile-pic"
              />
              <span className="username">@{reel.postedBy.username}</span>
            </div>
            <div className="caption">
              {reel.caption}
            </div>
          </div>
        </div>

        {/* Side Actions - Outside the video */}
        <div className="side-actions">
          <div className="action-btn-container">
            <button
              className={`action-btn ${isLiked ? 'liked' : ''}`}
              onClick={handleLike}
            >
              <Heart
                size={28}
                fill={isLiked ? '#ff3040' : 'none'}
                color={isLiked ? '#ff3040' : '#262626'}
              />
            </button>
            <span className="action-count">{likeCount}</span>
          </div>

          <div className="action-btn-container">
            <button
              className="action-btn"
              onClick={() => setShowComments(!showComments)}
              title={showComments ? "Hide comments" : "Show comments"}
            >
              <MessageCircle size={28} color="#262626" />
            </button>
            <span className="action-count">{comments.length}</span>
          </div>

          <div className="action-btn-container">
            <button className="action-btn" onClick={handleShare} title="Copy reel link">
              <Send size={28} color="#262626" />
            </button>
          </div>
        </div>
      </div>

      {/* Comments Modal */}
      {showComments && (
        <div className="comments-modal">
          <div className="comments-header">
            <h3>Comments</h3>
            <button
              className="close-btn"
              onClick={() => setShowComments(false)}
            >
              ×
            </button>
          </div>

          <div className="comments-list">
            {comments.map((comment, index) => (
              <div key={index} className="comment-item">
                <img
                  src={comment.user.profilePicture && (comment.user.profilePicture.startsWith('http') ? comment.user.profilePicture : `${import.meta.env.VITE_BASE_URL}/${comment.user.profilePicture}`) || '/default-profile.png'}
                  alt={comment.user.username}
                  className="comment-profile-pic"
                />
                <div className="comment-content">
                  <span className="comment-username">{comment.user.username}</span>
                  <span className="comment-text">{comment.text}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="comment-form">
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="comment-input"
              onKeyPress={(e) => e.key === 'Enter' && handleComment(e)}
            />
            <button
              onClick={handleComment}
              className="comment-submit"
              disabled={!newComment.trim() || loading}
            >
              {loading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
      )}

      {/* Delete Button for Owner */}
      {user?._id === reel.postedBy._id && (
        <div className="delete-btn-container">
          <button
            className="delete-btn"
            onClick={() => onDelete(reel._id)}
          >
            Delete
          </button>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default Reel;