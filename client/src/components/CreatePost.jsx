// src/pages/CreatePost.jsx
import { useState, useRef } from 'react';
import { Button, Form, Modal, Image, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import { getSocket } from '../utils/socket';
import '../css/CreatePost.css';

const CreatePost = () => {
  const [show, setShow] = useState(true);
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleClose = () => setShow(false);

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
      handleClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Create New Post</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        
        <div className="create-post-container">
          {preview ? (
            <div className="image-preview-container">
              <Image src={preview} alt="Preview" className="image-preview" />
            </div>
          ) : (
            <div className="upload-area" onClick={() => fileInputRef.current.click()}>
              <i className="bi bi-images fs-1"></i>
              <p>Drag photos and videos here or click to select</p>
              <Form.Control
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="d-none"
              />
            </div>
          )}
          
          <Form onSubmit={handleSubmit} className="caption-form">
            <Form.Group className="mb-3">
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="Write a caption..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
            </Form.Group>
            
            <Button
              variant="primary"
              type="submit"
              disabled={!image || loading}
              className="w-100"
            >
              {loading ? <Spinner size="sm" /> : 'Share'}
            </Button>
          </Form>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default CreatePost;