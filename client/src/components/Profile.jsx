import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, Image, Button, Form, Modal, Spinner, Alert, Tab, Tabs } from 'react-bootstrap';
import axios from 'axios';
import Post from '../components/Post';
import '../css/Profile.css';

import { useSocket } from '../context/SocketContext';

const Profile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    bio: '',
    profilePicture: '',
  });
  const [profileImagePreview, setProfileImagePreview] = useState('');
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const socket = useSocket();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const currentUser = JSON.parse(localStorage.getItem('user'));
        
        // Fetch user profile
        const userResponse = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        // Fetch user posts
        const postsResponse = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/posts/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        setUser(userResponse.data);
        setPosts(postsResponse.data);
        setIsCurrentUser(currentUser?._id === userId);

        // Check if current user is following this profile user
        const following = userResponse.data.followers || [];
        setIsFollowing(following.some(follower => follower._id === currentUser?._id));
        
        // Initialize edit form
        setEditForm({
          username: userResponse.data.username,
          bio: userResponse.data.bio || '',
          profilePicture: userResponse.data.profilePicture || '',
        });
        
        setProfileImagePreview(userResponse.data.profilePicture || '');
      } catch (err) {
        setError(err.response?.data?.message || 'Error loading profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  useEffect(() => {
    if (!socket) return;

    const handleSomeEvent = (data) => {
      // Handle socket events if needed
      console.log('Socket event received in Profile:', data);
    };

    socket.on('someEvent', handleSomeEvent);

    return () => {
      socket.off('someEvent', handleSomeEvent);
    };
  }, [socket]);

  const handleEditProfile = () => {
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleEditFormChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditForm({
        ...editForm,
        profilePicture: file,
      });
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmitProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      if (editForm.username) formData.append('username', editForm.username);
      if (editForm.bio) formData.append('bio', editForm.bio);
      if (editForm.profilePicture) {
        if (typeof editForm.profilePicture === 'object') {
          formData.append('profilePicture', editForm.profilePicture);
        }
      }

      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/user/update`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update local storage if current user
      const currentUser = JSON.parse(localStorage.getItem('user'));
      if (currentUser?._id === userId) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      setUser(response.data.user);
      setProfileImagePreview(response.data.user.profilePicture || '');
      setShowEditModal(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/posts/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPosts(posts.filter(post => post._id !== postId));
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting post');
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="profile-container">
      <Card className="profile-header mb-4">
        <Card.Body className="d-flex flex-column flex-md-row align-items-center">
          <div className="profile-pic-container mb-3 mb-md-0 me-md-5">
            <Image
             src={
  (profileImagePreview && 
    (profileImagePreview.startsWith('http') ? 
      profileImagePreview : 
      `${import.meta.env.VITE_BASE_URL}/${profileImagePreview}`)
  ) || 
  (user.profilePicture && 
    (user.profilePicture.startsWith('http') ? 
      user.profilePicture : 
      `${import.meta.env.VITE_BASE_URL}/${user.profilePicture}`)
  ) || 
  '/default_profile.jpg'  // This will use the frontend's public folder
}
              roundedCircle
              className="profile-pic"
            />
          </div>
          
          <div className="profile-info">
            <div className="d-flex align-items-center mb-3">
              <h2 className="me-3">{user.username}</h2>
              {isCurrentUser && (
                <Button variant="outline-secondary" onClick={handleEditProfile}>
                  Edit Profile
                </Button>
              )}
              {!isCurrentUser && (
                <Button
                  variant={isFollowing ? 'secondary' : 'primary'}
                  disabled={followLoading}
                  onClick={async () => {
                    setFollowLoading(true);
                    const token = localStorage.getItem('token');
                    try {
                      if (isFollowing) {
                        await axios.post(
                          `http://localhost:3000/api/user/unfollow/${userId}`,
                          {},
                          {
                            headers: {
                              Authorization: `Bearer ${token}`,
                            },
                          }
                        );
                      } else {
                        await axios.post(
                          `http://localhost:3000/api/user/follow/${userId}`,
                          {},
                          {
                            headers: {
                              Authorization: `Bearer ${token}`,
                            },
                          }
                        );
                      }
                      // Refetch user profile to update followers and isFollowing state
                      const userResponse = await axios.get(
                        `http://localhost:3000/api/user/${userId}`,
                        {
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        }
                      );
                      setUser(userResponse.data);
                      const currentUser = JSON.parse(localStorage.getItem('user'));
                      const following = userResponse.data.followers || [];
                      console.log('Followers after refetch:', following);
                      console.log('Current user ID:', currentUser._id);
                      const isFollowingNow = following.some(follower => follower._id === currentUser._id);
                      console.log('Is following:', isFollowingNow);
                      setIsFollowing(isFollowingNow);
                    } catch (err) {
                      console.error('Error following/unfollowing user:', err);
                    } finally {
                      setFollowLoading(false);
                    }
                  }}
                >
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </Button>
              )}
            </div>
            
            <div className="d-flex mb-3">
              <div className="me-4">
                <span className="fw-bold">{posts.length}</span> posts
              </div>
              <div className="me-4">
                <span className="fw-bold">{user.followers?.length || 0}</span> followers
              </div>
              <div>
                <span className="fw-bold">{user.following?.length || 0}</span> following
              </div>
            </div>
            
            {user.bio && (
              <div className="bio">
                <p>{user.bio}</p>
              </div>
            )}
          </div>
        </Card.Body>
      </Card>
      
      <Tabs defaultActiveKey="posts" id="profile-tabs" className="mb-3">
        <Tab eventKey="posts" title="Posts">
          <div className="posts-grid">
            {posts.length > 0 ? (
              posts.map((post) => (
                <Post 
                  key={post._id} 
                  post={post} 
                  onDelete={handleDeletePost} 
                  user={JSON.parse(localStorage.getItem('user'))} 
                />
              ))
            ) : (
              <div className="text-center py-5">
                <h4>No posts yet</h4>
                {isCurrentUser && (
                  <p>Share your first photo or video</p>
                )}
              </div>
            )}
          </div>
        </Tab>
        
      </Tabs>
      
      {/* Edit Profile Modal */}
      <Modal show={showEditModal} onHide={handleCloseEditModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitProfileUpdate}>
            <Form.Group className="mb-3 text-center">
              <Image
          src={
  (profileImagePreview && 
    (profileImagePreview.startsWith('http') ? 
      profileImagePreview : 
      `${import.meta.env.VITE_BASE_URL}/${profileImagePreview}`)
  ) || 
  (user.profilePicture && 
    (user.profilePicture.startsWith('http') ? 
      user.profilePicture : 
      `${import.meta.env.VITE_BASE_URL}/${user.profilePicture}`)
  ) || 
  '/default-profile.png'  // This will use the frontend's public folder
}
                roundedCircle
                className="profile-pic-lg mb-2"
              />
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleProfileImageChange}
                className="d-none"
                id="profileImageInput"
              />
              <Button
                variant="outline-secondary"
                onClick={() => document.getElementById('profileImageInput').click()}
                className="w-100"
              >
                Change Profile Photo
              </Button>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={editForm.username}
                onChange={handleEditFormChange}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Bio</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="bio"
                value={editForm.bio}
                onChange={handleEditFormChange}
                placeholder="Tell your story..."
              />
            </Form.Group>
            
            <Button
              variant="primary"
              type="submit"
              disabled={loading}
              className="w-100"
            >
              {loading ? <Spinner size="sm" /> : 'Submit'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Profile;