// src/pages/CreatePost.jsx
import { useState, useRef } from 'react';
import { Button, Form, Image, Spinner, Alert, Card } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getSocket } from '../utils/socket';
import '../css/CreatePost.css';

const CreatePost = () => {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return;

    try {
      setLoading(true);
      setError('');

      const formData = new FormData();
      formData.append('caption', caption);
      formData.append('imageUrl', image);

      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/posts`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Emit new post event
      const socket = getSocket();
      socket.emit('newPost', response.data);

      // Reset form
      setCaption('');
      setImage(null);
      setPreview('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Navigate to home to see the new post
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-page">
      <Card className="create-post-card shadow-sm">
        <Card.Header className="bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
          <h2 className="mb-0 fs-5 fw-bold">Create New Post</h2>
          {preview && (
            <Button
              variant="link"
              className="text-primary text-decoration-none fw-bold p-0"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? <Spinner animation="border" size="sm" /> : 'Share'}
            </Button>
          )}
        </Card.Header>
        <Card.Body className="p-0">
          {error && <Alert variant="danger" className="m-3">{error}</Alert>}

          <div className="create-post-layout">
            <div className="media-section">
              {preview ? (
                <div className="image-preview-container">
                  <Image src={preview} alt="Preview" className="image-preview" />
                  <Button
                    variant="dark"
                    size="sm"
                    className="change-media-btn"
                    onClick={() => fileInputRef.current.click()}
                  >
                    Change Image
                  </Button>
                </div>
              ) : (
                <div className="upload-placeholder" onClick={() => fileInputRef.current.click()}>
                  <div className="dotted-circle-plus">
                    <span className="plus-icon">+</span>
                  </div>
                  <span className="upload-text">Select from device</span>
                </div>
              )}
              <Form.Control
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="d-none"
              />
            </div>

            <div className="details-section">
              <Form onSubmit={handleSubmit} className="h-100 d-flex flex-column">
                <div className="caption-box-container">
                  <Form.Control
                    as="textarea"
                    placeholder="Write a caption..."
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="caption-textarea shadow-none"
                  />
                </div>

                <div className="p-3 border-top d-lg-none">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={!image || loading}
                    className="w-100 fw-bold rounded-pill"
                  >
                    {loading ? <Spinner size="sm" /> : 'Share Post'}
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CreatePost;