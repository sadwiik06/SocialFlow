import './App.css'
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import ChatPage from './components/ChatPage'
import Search from './components/Search'
import Home from './components/Home'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Profile from './components/Profile'
import CreatePost from './components/CreatePost';
import InstagramReelsFeed from './components/InstagramReelsFeed';
import Post from './components/Post';
import PostsList from './components/PostsList';
import PostDetail from './components/PostDetail';

import CreateReel from './components/CreateReel';

import { SocketProvider } from './context/SocketContext';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
  }, []);

  if (user === null) {
    // User not logged in, render public routes including Home at "/"
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    );
  }

  // User logged in, render protected routes
  return (
    <SocketProvider token={user.token}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout user={user} />
            </ProtectedRoute>
          }>
            <Route index element={<PostsList user={user} />} />
            <Route path="posts/:id" element={<PostDetail />} />
            <Route path="reels" element={<InstagramReelsFeed user={user} />} />
            <Route path="reels/:id" element={<InstagramReelsFeed user={user} />} />
            <Route path="search" element={<Search />} />
            <Route path="profile/:userId" element={<Profile />} />
            <Route path="chat/:userId" element={<ChatPage />} />
            <Route path="create" element={<CreatePost />} />
            <Route path="create-reel" element={<CreateReel />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SocketProvider>
  )
}

export default App
