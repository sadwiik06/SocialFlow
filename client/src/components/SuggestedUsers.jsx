// src/components/SuggestedUsers.jsx
import { useState, useEffect } from 'react';
import { Card, ListGroup, Spinner, Image, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../css/SuggestedUsers.css';

const SuggestedUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/user/suggested', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);

        // Initialize following state based on current user's following list
        const currentUser = JSON.parse(localStorage.getItem('user'));
        if (currentUser && currentUser.following) {
          setFollowing(currentUser.following);
        }
      } catch (err) {
        console.error('Error fetching suggested users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestedUsers();
  }, []);

  const handleFollow = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:3000/api/user/follow/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFollowing(prev => [...prev, userId]);
    } catch (err) {
      console.error('Error following user:', err);
    }
  };

  return (
    <Card className="suggested-users-card">
      <Card.Header className="suggested-users-header">
        <span className="suggested-users-title">Suggested for you</span>
       
      </Card.Header>
      
      {loading ? (
        <div className="suggested-users-loading">
          <Spinner animation="border" size="sm" />
        </div>
      ) : (
        <ListGroup variant="flush" className="suggested-users-list">
          {users.map((user) => (
            <ListGroup.Item key={user._id} className="suggested-user-item">
              <Link 
                to={`/profile/${user._id}`} 
                className="suggested-user-link"
              >
                <Image
                  src={
                    (user.profilePicture && (user.profilePicture.startsWith('http') ? user.profilePicture : `http://localhost:3000/${user.profilePicture}`)) 
                    || '/default-profile.png'
                  }
                  roundedCircle
                  className="suggested-user-avatar"
                />
                <div className="suggested-user-info">
                  <div className="suggested-user-username">{user.username}</div>
                  <small className="suggested-user-subtext">Suggested for you</small>
                </div>
              </Link>
              <Button 
                variant={following.includes(user._id) ? 'secondary' : 'primary'}
                className={`suggested-user-follow-btn ${following.includes(user._id) ? 'following' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleFollow(user._id);
                }}
                disabled={following.includes(user._id)}
              >
                {following.includes(user._id) ? 'Following' : 'Follow'}
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </Card>
  );
};

export default SuggestedUsers;
