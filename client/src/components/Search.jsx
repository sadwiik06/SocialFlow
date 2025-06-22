import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Spinner from 'react-bootstrap/Spinner';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import '../css/Search.css';
const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }

    const searchUsers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/user/search?q=${query}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      searchUsers();
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setShowOptions(true);
  };

  const handleClose = () => {
    setShowOptions(false);
    setSelectedUser(null);
  };

  const handleViewProfile = () => {
    if (selectedUser) {
      navigate(`/profile/${selectedUser._id}`);
      handleClose();
    }
  };

  const handleChat = () => {
    if (selectedUser) {
      navigate(`/chat/${selectedUser._id}`);
      handleClose();
    }
  };

  return (
    <div className="search-container">
      <Form.Group controlId="search">
        <Form.Control
          type="text"
          placeholder="Search users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </Form.Group>

      {loading && (
        <div className="text-center mt-2">
          <Spinner animation="border" size="sm" />
        </div>
      )}

      {results.length > 0 && (
        <ListGroup className="search-results mt-2">
          {results.map((user) => (
            <ListGroup.Item
              key={user._id}
              action
              onClick={() => handleUserClick(user)}
              className="d-flex align-items-center"
            >
              <img
                src={user.profilePicture || '/default-profile.png'}
                alt={user.username}
                className="profile-pic-sm me-2"
              />
              <div>
                <div className="fw-bold">{user.username}</div>
                <small className="text-muted">{user.bio}</small>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}

      <Modal show={showOptions} onHide={handleClose} centered className="search-modal">
        <Modal.Header closeButton>
          <Modal.Title>Choose an option</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>What would you like to do with <strong>{selectedUser?.username}</strong>?</p>
          <div className="d-flex justify-content-around">
            <Button variant="primary" onClick={handleViewProfile}>
              View Profile
            </Button>
            <Button variant="success" onClick={handleChat}>
              Chat
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Search;
