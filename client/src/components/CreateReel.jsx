import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/CreateReel.css';

const CreateReel = () => {
  const [caption, setCaption] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
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
    <div className="create-reel-container">
      <h2>Create New Reel</h2>
      <form onSubmit={handleSubmit} className="create-reel-form">
        <div className="form-group">
          <label htmlFor="caption">Caption</label>
          <input
            type="text"
            id="caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            maxLength={300}
            placeholder="Write a caption..."
          />
        </div>
        <div className="form-group">
          <label htmlFor="videoUrl">Upload Video</label>
          <input
            type="file"
            id="videoUrl"
            accept="video/*"
            onChange={handleFileChange}
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload Reel'}
        </button>
      </form>
    </div>
  );
};

export default CreateReel;
