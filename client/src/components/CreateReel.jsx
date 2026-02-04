import { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Card, Form, Button, Spinner, Alert } from 'react-bootstrap';
import '../css/CreateReel.css';

const CreateReel = () => {
  const [caption, setCaption] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile) {
      setError('Please select a video file');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('caption', caption);
      formData.append('videoUrl', videoFile);

      const token = localStorage.getItem('token');
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/reels`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        navigate('/reels');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error uploading reel');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-reel-page">
      <Card className="create-reel-card shadow-sm">
        <Card.Header className="bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
          <h2 className="mb-0 fs-5 fw-bold">Create New Reel</h2>
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

          <div className="create-reel-layout">
            <div className="video-section">
              {preview ? (
                <div className="video-preview-container">
                  <video src={preview} controls className="video-preview" />
                  <Button
                    variant="dark"
                    size="sm"
                    className="change-video-btn"
                    onClick={() => fileInputRef.current.click()}
                  >
                    Change Video
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
              <input
                type="file"
                ref={fileInputRef}
                accept="video/*"
                onChange={handleFileChange}
                className="d-none"
              />
            </div>

            <div className="details-section">
              <Form onSubmit={handleSubmit} className="h-100 d-flex flex-column">
                <div className="caption-box-container">
                  <Form.Control
                    as="textarea"
                    placeholder="Write a caption for your reel..."
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="caption-textarea shadow-none"
                    maxLength={300}
                  />
                  <div className="text-end text-muted small mt-2">
                    {caption.length}/300
                  </div>
                </div>

                <div className="p-3 border-top d-lg-none">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={!videoFile || loading}
                    className="w-100 fw-bold rounded-pill"
                  >
                    {loading ? <Spinner size="sm" /> : 'Share Reel'}
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

export default CreateReel;
