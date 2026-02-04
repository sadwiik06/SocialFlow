import { useState, useEffect, useCallback } from 'react';
import Post from './Post';
import SuggestedUsers from './SuggestedUsers';
import { Spinner, Alert, Container, Row, Col } from 'react-bootstrap';
import { getSocket, initSocket } from '../utils/socket';
import axios from 'axios';

const PostsList = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  // Stable socket event handlers using useCallback
  const handlePostLiked = useCallback(({ postId, userId }) => {
    setPosts(prevPosts => {
      return prevPosts.map(post => {
        if (post._id === postId) {
          const hasLiked = post.likes.some(id => id.toString() === userId.toString());
          const newLikes = hasLiked
            ? post.likes.filter(id => id.toString() !== userId.toString())
            : [...post.likes, userId.toString()];
          return { ...post, likes: newLikes };
        }
        return post;
      });
    });
  }, []);

  const handlePostCommented = useCallback(({ postId, comment }) => {
    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post._id === postId) {
          // Check if comment already exists to avoid duplicates
          const commentExists = post.comments.some(c => c._id === comment._id);
          if (commentExists) {
            return post;
          }
          return { ...post, comments: [...post.comments, comment] };
        }
        return post;
      })
    );
  }, []);

  const handlePostCreated = useCallback((newPost) => {
    setPosts(prev => [newPost, ...prev]);
  }, []);

  const handlePostDeleted = useCallback(({ postId }) => {
    setPosts(prev => prev.filter(post => post._id !== postId));
  }, []);

  useEffect(() => {
    const fetchPostsAndSetupSocket = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/posts?page=${page}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const deduplicatePosts = (postsArray) => {
          const seen = new Set();
          return postsArray.filter(post => {
            if (seen.has(post._id)) {
              return false;
            }
            seen.add(post._id);
            return true;
          });
        };

        setPosts(prev => {
          const combined = page === 1 ? response.data : [...prev, ...response.data];
          return deduplicatePosts(combined);
        });
        setHasMore(response.data.length > 0);

        if (page === 1) {
          // Initialize socket
          initSocket(token);

          // Setup socket listeners
          const socket = getSocket();

          socket.on('postLiked', handlePostLiked);
          socket.on('postCommented', handlePostCommented);
          socket.on('postCreated', handlePostCreated);
          socket.on('postDeleted', handlePostDeleted);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPostsAndSetupSocket();

    return () => {
      try {
        const socket = getSocket();
        if (socket) {
          socket.off('postLiked', handlePostLiked);
          socket.off('postCommented', handlePostCommented);
          socket.off('postCreated', handlePostCreated);
          socket.off('postDeleted', handlePostDeleted);

        }
      } catch {
        // Socket not initialized, ignore
      }
    };
  }, [user, page, handlePostLiked, handlePostCommented, handlePostCreated, handlePostDeleted]);

  const handleDelete = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting post');
    }
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      handleLoadMore();
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

  if (loading && page === 1) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-3">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (posts.length === 0 && !loading) {
    return (
      <Container className="text-center my-5">
        <h4>No posts found</h4>
        <p>Follow some users or create your first post!</p>
      </Container>
    );
  }

  return (
    <div className="home-content-flex">
      <div className="posts-feed-column">
        {posts.map(post => (
          <Post key={post._id} post={post} user={user} onDelete={handleDelete} />
        ))}
        {loading && page > 1 && (
          <div className="text-center my-3">
            <Spinner animation="border" size="sm" />
          </div>
        )}
        {!hasMore && posts.length > 0 && (
          <div className="text-center text-muted my-3">
            You've reached the end
          </div>
        )}
      </div>

      <div className="suggested-column d-none d-xl-block">
        <div className="suggested-sticky-container">
          <SuggestedUsers />
        </div>
      </div>
    </div>
  );
};

export default PostsList;
