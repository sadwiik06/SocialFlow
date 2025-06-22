import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Post from './Post';
import Spinner from 'react-bootstrap/Spinner';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/posts/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPost(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return <div className="text-center mt-5"><Spinner animation="border" /></div>;
  }

  if (error) {
    return <div className="text-danger text-center mt-5">{error}</div>;
  }

  if (!post) {
    return <div className="text-center mt-5">Post not found</div>;
  }

  return (
    <div className="post-detail-container mt-4">
      <Post post={post} user={post.postedBy} />
    </div>
  );
};

export default PostDetail;
