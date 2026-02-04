import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ChevronUp, ChevronDown } from 'lucide-react';
import axios from 'axios';
import Reel from './Reel';

const InstagramReelsFeed = ({ user }) => {
  const navigate = useNavigate();
  const { id: reelIdFromUrl } = useParams();
  const location = useLocation();
  const containerRef = useRef(null);

  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [activeReelId, setActiveReelId] = useState(null);

  // Initial load
  useEffect(() => {
    fetchReels(0, true);
  }, []);

  const fetchReels = async (pageNum, isInitial = false) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/reels/feed?page=${pageNum}&limit=5`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const newReels = response.data.reels;
      setReels(prev => isInitial ? newReels : [...prev, ...newReels]);
      setHasMore(response.data.hasMore);

      if (isInitial && newReels.length > 0) {
        setActiveReelId(newReels[0]._id);
      }
    } catch (err) {
      setError('Error fetching reels feed');
    } finally {
      setLoading(false);
    }
  };

  // Intersection Observer to detect active reel
  useEffect(() => {
    if (reels.length === 0) return;

    const options = {
      root: containerRef.current,
      rootMargin: '0px',
      threshold: 0.6
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('data-id');
          setActiveReelId(id);

          // Update URL without heavy re-renders
          if (location.pathname !== `/reels/${id}`) {
            window.history.replaceState(null, '', `/reels/${id}`);
          }
        }
      });
    }, options);

    const items = document.querySelectorAll('.reel-snap-item');
    items.forEach(item => observer.observe(item));

    return () => observer.disconnect();
  }, [reels]);

  // Infinite Scroll Trigger
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 100 && hasMore && !loading) {
      setPage(prev => {
        const next = prev + 1;
        fetchReels(next);
        return next;
      });
    }
  };

  const scrollToIndex = (direction) => {
    if (!containerRef.current) return;

    const currentIndex = reels.findIndex(r => r._id === activeReelId);
    let nextIndex = direction === 'down' ? currentIndex + 1 : currentIndex - 1;

    if (nextIndex >= 0 && nextIndex < reels.length) {
      const target = containerRef.current.children[nextIndex];
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="reels-page-wrapper">
      <div
        ref={containerRef}
        className="reels-feed-container"
        onScroll={handleScroll}
      >
        {reels.map((reel) => (
          <div
            key={reel._id}
            className="reel-snap-item"
            data-id={reel._id}
          >
            <Reel
              reel={reel}
              user={user}
              isActive={activeReelId === reel._id}
            />
          </div>
        ))}

        {loading && (
          <div className="flex items-center justify-center p-10 text-white">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}
      </div>

      {/* Navigation Arrows for Desktop */}
      <div className="reels-nav-arrows">
        <button
          className="nav-arrow-btn"
          onClick={() => scrollToIndex('up')}
          disabled={reels.findIndex(r => r._id === activeReelId) <= 0}
        >
          <ChevronUp size={24} />
        </button>
        <button
          className="nav-arrow-btn"
          onClick={() => scrollToIndex('down')}
          disabled={!hasMore && reels.findIndex(r => r._id === activeReelId) === reels.length - 1}
        >
          <ChevronDown size={24} />
        </button>
      </div>

      {error && (
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg z-50">
          {error}
        </div>
      )}
    </div>
  );
};

export default InstagramReelsFeed;
