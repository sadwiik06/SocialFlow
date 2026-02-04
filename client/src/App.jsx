import './App.css'
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
import PostsList from './components/PostsList';
import PostDetail from './components/PostDetail';
import CreateReel from './components/CreateReel';

import { SocketProvider } from './context/SocketContext';
import { AuthProvider, useAuth } from './context/AuthContext';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Loading SocialFlow...</div>;
  }

  if (!user) {
    // User not logged in, render public routes including Home at "/"
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    );
  }

  // User logged in, render protected routes
  const token = localStorage.getItem('token'); // Get token for socket provider

  return (
    <SocketProvider token={token}>
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
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App
