import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Heart, MessageCircle, Send, Volume2, VolumeX, ChevronUp, ChevronDown } from 'lucide-react';
import axios from 'axios';
import { initSocket } from '../utils/socket';
import Reel from './Reel';

const InstagramReelsFeed = ({ user }) => {
  const navigate = useNavigate();
  const { id: reelIdFromUrl } = useParams();
  const location = useLocation();

  const [currentReel, setCurrentReel] = useState(null);
  const [nextReel, setNextReel] = useState(null);
  const [prevReel, setPrevReel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasNext, setHasNext] = useState(true);
  const [hasPrev, setHasPrev] = useState(false);

  // Video controls
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Interactions
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  // Touch/swipe handling
  const [lastTap, setLastTap] = useState(0);

  // Socket instance
  const socketRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    socketRef.current = initSocket(token);

    const socket = socketRef.current;

    // Listen for reel like updates
    socket.on('reelLiked', ({ likesCount, userId }) => {
      setLikeCount(likesCount);
      setIsLiked(userId === user?._id);
    });

    // Listen for reel comment updates
    socket.on('reelCommented', ({ comment }) => {
      setComments(prevComments => [...prevComments, comment]);
    });

    // Listen for new reels added
    socket.on('newReel', (newReel) => {
      setNextReel(newReel._id);
      setHasNext(true);
    });

    return () => {
      socket.off('reelLiked');
      socket.off('reelCommented');
      socket.off('newReel');
    };
  }, [user?._id]);
  const fetchReelWithContextByIndex = async (index) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/reels/context?index=${index}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const { reel, hasNext: _hasNext, hasPrev: _hasPrev, nextReelId, prevReelId } = response.data;
      
      console.log('Preload nextReelId:', nextReelId);
      console.log('Preload prevReelId:', prevReelId);

      setCurrentReel(reel);
      setHasNext(_hasNext);
      setHasPrev(_hasPrev);
      setNextReel(nextReelId || null);
      setPrevReel(prevReelId !== undefined ? prevReelId : null);
      
      // Set interaction states
      setIsLiked(reel.likes.includes(user?._id));
      setLikeCount(reel.likes.length);
      setComments(reel.comments);

      // Update URL to current reel id
      if (reel && reel._id && location.pathname !== `/reels/${reel._id}`) {
        navigate(`/reels/${reel._id}`, { replace: true });
      }
      
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching reel');
    } finally {
      setLoading(false);
    }
  };

  const fetchReelWithContextById = async (reelId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/reels/contextById/${reelId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const { reel, hasNext: _hasNext, hasPrev: _hasPrev, nextReelId, prevReelId } = response.data;
      
      setCurrentReel(reel);
      setHasNext(_hasNext);
      setHasPrev(_hasPrev);
      setNextReel(nextReelId || null);
      setPrevReel(prevReelId || null);
      
      // Set interaction states
      setIsLiked(reel.likes.includes(user?._id));
      setLikeCount(reel.likes.length);
      setComments(reel.comments);
      
      // Update URL if needed
      if (reel?._id && location.pathname !== `/reels/${reel._id}`) {
        navigate(`/reels/${reel._id}`, { replace: true });
      }
      
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching reel');
    } finally {
      setLoading(false);
    }
  };

  // Initial load or URL change
  useEffect(() => {
    if (reelIdFromUrl) {
      fetchReelWithContextById(reelIdFromUrl);
    } else {
      fetchReelWithContextByIndex(0);
    }
  }, [reelIdFromUrl]);

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !currentReel) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      // Auto-advance to next reel when current ends
      if (hasNext) {
        goToNext();
      } else {
        video.currentTime = 0;
      }
    };

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('ended', handleEnded);

    // Auto play when reel changes
    const playVideo = async () => {
      try {
        await video.play();
        setIsPlaying(true);
      } catch (error) {
        console.log('Autoplay failed:', error);
      }
    };

    video.load(); // Reload video source
    if (video.readyState >= 2) {
      playVideo();
    } else {
      video.addEventListener('loadeddata', playVideo, { once: true });
    }

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('ended', handleEnded);
    };
  }, [currentReel, hasNext]);

  // Navigation functions
  const goToNext = () => {
    if (hasNext && nextReel) {
      fetchReelWithContextById(nextReel);
    }
  };

  const goToPrev = () => {
    if (hasPrev && prevReel) {
      fetchReelWithContextById(prevReel);
    }
  };

  // Removed unused touch handlers for swipe navigation

  // Attach global event listeners for wheel and keyboard navigation
  useEffect(() => {
    window.addEventListener('wheel', onWheel);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [hasNext, hasPrev, nextReel, prevReel]);

  // Mouse wheel handler for scrolling reels
  const onWheel = (e) => {
    if (e.deltaY > 0 && hasNext) {
      goToNext();
    } else if (e.deltaY < 0 && hasPrev) {
      goToPrev();
    }
  };

  // Keyboard handler for arrow keys navigation
  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown' && hasNext) {
      goToNext();
    } else if (e.key === 'ArrowUp' && hasPrev) {
      goToPrev();
    }
  };

  // Double tap to like
  const handleVideoClick = () => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    
    if (lastTap && (now - lastTap) < DOUBLE_PRESS_DELAY) {
      handleLike();
      setLastTap(0);
    } else {
      setLastTap(now);
      setTimeout(() => {
        if (lastTap === now) {
          togglePlay();
        }
        setLastTap(0);
      }, DOUBLE_PRESS_DELAY);
    }
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleLike = async () => {
    if (!currentReel) return;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/reels/like/${currentReel._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setIsLiked(response.data.isLiked);
      setLikeCount(response.data.likesCount);
    } catch {
      setError('Error liking reel');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !currentReel) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/reels/comment/${currentReel._id}`,
        { text: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setComments(prev => [...prev, response.data.comment]);
      setNewComment('');
    } catch {
      setError('Error adding comment');
    }
  };

  const handleShare = async () => {
    const reelUrl = `${window.location.origin}/reels/${currentReel._id}`;
    try {
      await navigator.clipboard.writeText(reelUrl);
      setError('Link copied to clipboard!');
      setTimeout(() => setError(''), 2000);
    } catch {
      setError('Failed to copy link');
    }
  };

  if (loading && !currentReel) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!currentReel) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <div className="text-xl">No reels available</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Reel
        reel={currentReel}
        nextReel={nextReel}
        prevReel={prevReel}
        isLiked={isLiked}
        likeCount={likeCount}
        comments={comments}
        showComments={showComments}
        newComment={newComment}
        onToggleComments={() => setShowComments(!showComments)}
        onNewCommentChange={setNewComment}
        onLike={handleLike}
        onComment={handleComment}
        onShare={handleShare}
        onVideoClick={handleVideoClick}
        isMuted={isMuted}
        onToggleMute={toggleMute}
        isPlaying={isPlaying}
        onTogglePlay={togglePlay}
        currentTime={currentTime}
        duration={duration}
        onNext={goToNext}
        onPrev={goToPrev}
      />
      {error && (
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg z-50">
          {error}
        </div>
      )}
    </div>
  );
};

export default InstagramReelsFeed;
