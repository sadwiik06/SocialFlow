// src/pages/ChatPage.jsx
import { useState, useEffect, useRef,} from 'react';
import { useParams} from 'react-router-dom';
import { Container, Form, Button, ListGroup, Spinner, Alert, Image } from 'react-bootstrap';
import { getSocket, initSocket } from '../utils/socket';
import '../css/ChatPage.css';
const ChatPage = () => {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [chatId, setChatId] = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const messagesEndRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Initialize chat and fetch messages
  useEffect(() => {
    const initializeChat = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = JSON.parse(localStorage.getItem('user'));
        setCurrentUserId(userData._id);
        // 1. Get or create chat
        const chatResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/api/chat/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId }),
        });
        const chatData = await chatResponse.json();
        setChatId(chatData._id);

        // Connect to socket
        initSocket(token);
        const socket = getSocket();

        // Join the chat room via socket
        socket.emit('joinChat', chatData._id);

        // 2. Get other user info
        const userResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/api/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userData2 = await userResponse.json();
        setOtherUser(userData2);

        // 3. Get existing messages
        const messagesResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/api/message/${chatData._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const messagesData = await messagesResponse.json();
        setMessages(messagesData);

        // 4. Set up socket listeners
        const handleNewMessage = (message) => {
          console.log('Received newMessage event:', message);
          if (message.chatId === chatData._id) {
            // Ensure sender is always an object with _id
            let normalizedMessage = { ...message };
            if (normalizedMessage.sender && typeof normalizedMessage.sender === 'string') {
              normalizedMessage.sender = { _id: normalizedMessage.sender };
            }
            setMessages((prev) => {
              // Check if message already exists to prevent duplicates
              if (prev.some((msg) => msg._id === normalizedMessage._id)) {
                console.log('Duplicate message ignored:', normalizedMessage._id);
                return prev;
              }
                return [...prev, normalizedMessage];
                // Also add the message if sender is current user (optimistic update)
            });
          }
        };

        socket.on('newMessage', handleNewMessage);

        socket.on('connect_error', (err) => {
          setError('Connection error: ' + err.message);
        });

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeChat();

    return () => {
      try {
        const socket = getSocket();
        socket.off('newMessage');
        socket.off('connect_error');
       
      } catch {
        // Socket not initialized, ignore
      }
    };
  }, [userId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatId) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          chatId,
          text: newMessage,
        }),
      });

      if (response.ok) {
        setNewMessage('');
        let message = await response.json();
        if (!message.sender || !message.sender._id) {
          message.sender = { _id: currentUserId };
        }
        setMessages((prev) => [...prev, message]); // Optimistic UI update
        const socket = getSocket();
        socket.emit('sendMessage', message);
      } else {
        throw new Error('Failed to send message');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <Container className="chat-container">
        <div className="text-center mt-5">
          <Spinner animation="border" />
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="chat-container">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="chat-container">
      {otherUser && (
        <div className="chat-header">
          <div className="d-flex align-items-center">
            <Image
              src={otherUser.profilePicture || '/default-profile.png'}
              roundedCircle
              className="profile-pic-chat me-2"
            />
            <h5>{otherUser.username}</h5>
          </div>
        </div>
      )}
      <div className="messages-container">
        {messages.map((message) => {
          console.log('currentUserId:', currentUserId, 'message.sender._id:', message.sender._id);
          return (
            <div
              key={message._id}
              className={`message ${message.sender._id === currentUserId ? 'sent' : 'received'}`}
            >
              <div className="message-content">{message.text}</div>
              <div className="message-time">
                {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <Form onSubmit={handleSendMessage} className="message-form">
        <Form.Group className="d-flex">
          <Form.Control
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button variant="primary" type="submit" disabled={!newMessage.trim()}>
            Send
          </Button>
        </Form.Group>
      </Form>
    </Container>
  );
};

export default ChatPage;
