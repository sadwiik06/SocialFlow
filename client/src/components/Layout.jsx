// src/components/Layout.jsx
import { useState, useEffect } from 'react';
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import { Container, Navbar, Nav, Offcanvas, Button } from 'react-bootstrap';
import { initSocket, disconnectSocket } from '../utils/socket';
import '../css/Layout.css';

const Layout = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeLink, setActiveLink] = useState('');

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  useEffect(() => {
    if (user) {
      const token = localStorage.getItem('token');
      initSocket(token);
    }
    
  }, [user]);

  const handleCloseSidebar = () => setShowSidebar(false);
  const handleShowSidebar = () => setShowSidebar(true);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    disconnectSocket();
    navigate('/login');
  };

  const sidebarLinks = [
    { path: '/', icon: 'bi-house', label: 'Home' },
    { path: '/search', icon: 'bi-search', label: 'Search' },
    { path: '/reels', icon: 'bi-film', label: 'Reels' },
    { path: '/create', icon: 'bi-plus-square', label: 'Create Post' },
    { path: '/create-reel', icon: 'bi-camera-video', label: 'Create Reel' },
    { path: `/profile/${user?._id}`, icon: 'bi-person', label: 'Profile' },
  ];

  if (!user) {
    return null;
  }

  return (
    <>
      {/* Mobile Bottom Navbar */}
      <Navbar fixed="bottom" className="d-lg-none mobile-nav">
        <Nav className="w-100 justify-content-around">
          {sidebarLinks.slice(0, 4).map((link) => (
            <Nav.Link
              key={link.path}
              as={Link}
              to={link.path}
              className={activeLink === link.path ? 'active' : ''}
            >
              <i className={`bi ${link.icon} fs-4`}></i>
            </Nav.Link>
          ))}
          <Button variant="link" onClick={handleShowSidebar}>
            <i className="bi-list fs-4"></i>
          </Button>
        </Nav>
      </Navbar>

      {/* Desktop Sidebar */}
      <div className="d-none d-lg-block sidebar">
        <div className="sidebar-content">
          <div className="sidebar-header">
            <h1 className="socialflow-logo">SocialFlow</h1>
          </div>

          <Nav className="flex-column">
            {sidebarLinks.map((link) => (
              <Nav.Link
                key={link.path}
                as={Link}
                to={link.path}
                className={activeLink === link.path ? 'active' : ''}
              >
                <i className={`bi ${link.icon} me-3`}></i>
                <span>{link.label}</span>
              </Nav.Link>
            ))}
          </Nav>

          <div className="sidebar-footer">
            <Nav.Link as={Link} to={`/profile/${user._id}`} className="d-flex align-items-center">
              <img
                src={user.profilePicture && (user.profilePicture.startsWith('http') ? user.profilePicture : `http://localhost:3000/${user.profilePicture}`) || '/default-profile.png'}
                alt={user.username}
                className="profile-pic-sm me-2"
              />
              <span>{user.username}</span>
            </Nav.Link>
            <Button variant="link" onClick={logout}>
              <i className="bi-box-arrow-right me-3"></i>
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Offcanvas */}
      <Offcanvas show={showSidebar} onHide={handleCloseSidebar} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            {sidebarLinks.map((link) => (
              <Nav.Link
                key={link.path}
                as={Link}
                to={link.path}
                onClick={handleCloseSidebar}
                className={activeLink === link.path ? 'active' : ''}
              >
                <i className={`bi ${link.icon} me-3`}></i>
                <span>{link.label}</span>
              </Nav.Link>
            ))}
            <Button variant="link" onClick={logout} className="text-start">
              <i className="bi-box-arrow-right me-3"></i>
              <span>Logout</span>
            </Button>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Main Content */}
      <Container fluid className="main-content">
        <Outlet />
      </Container>
    </>
  );
};

export default Layout;
