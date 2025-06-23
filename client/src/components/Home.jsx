import React, { useState, useEffect } from "react";
import {
  Camera,
  Heart,
  MessageCircle,
  Share2,
  Users,
  Zap,
  Shield,
  Smartphone,
} from "lucide-react";
import { useNavigate } from "react-router-dom"; // <-- Add this import

export default function SocialFlowHomepage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showEntry, setShowEntry] = useState(true);
  const [doorAnimation, setDoorAnimation] = useState(false);
  const navigate = useNavigate(); // <-- Add this line

  useEffect(() => {
    // Start door animation after 1.5 seconds
    const timer = setTimeout(() => {
      setDoorAnimation(true);
    }, 1500);

    // Hide entry screen after 4 seconds
    const entryTimer = setTimeout(() => {
      setShowEntry(false);
    }, 4000);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      clearTimeout(timer);
      clearTimeout(entryTimer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSkipEntry = () => {
    setDoorAnimation(true);
    setTimeout(() => setShowEntry(false), 800);
  };

  const features = [
    {
      icon: <Camera size={48} />,
      title: "Capture Moments",
      description:
        "Share your life through stunning photos and videos with powerful editing tools",
    },
    {
      icon: <Heart size={48} />,
      title: "Connect & Engage",
      description:
        "Like, comment, and interact with friends and creators from around the world",
    },
    {
      icon: <Users size={48} />,
      title: "Build Community",
      description:
        "Follow your interests, discover new creators, and build meaningful connections",
    },
    {
      icon: <Zap size={48} />,
      title: "Lightning Fast",
      description:
        "Experience seamless scrolling and instant uploads with our optimized platform",
    },
  ];

  return (
    <div className="app-container">
      {/* Entry Animation Screen */}
      {showEntry && (
        <div className="entry-screen">
          <div className="entry-background"></div>

          {/* Door Animation */}
          <div
            className={`door-container ${doorAnimation ? "doors-opening" : ""}`}
          >
            <div className="door door-left">
              <div className="door-content">
                <div className="door-pattern"></div>
              </div>
            </div>
            <div className="door door-right">
              <div className="door-content">
                <div className="door-pattern"></div>
              </div>
            </div>
          </div>

          {/* Center Logo */}
          <div className={`entry-logo ${doorAnimation ? "logo-fade" : ""}`}>
            <div className="logo-container">
              <div className="logo-icon">
                <Camera size={64} color="white" />
              </div>
              <h1 className="logo-text">Social Flow</h1>
              <div className="logo-subtitle">Share Your Story</div>
            </div>
          </div>

          {/* Skip Button */}
          <button className="skip-button" onClick={handleSkipEntry}>
            Skip Animation
          </button>

          {/* Floating Elements */}
          <div className="floating-elements">
            <div className="floating-heart">
              <Heart size={24} color="white" />
            </div>
            <div className="floating-message">
              <MessageCircle size={20} color="white" />
            </div>
            <div className="floating-camera">
              <Camera size={28} color="white" />
            </div>
            <div className="floating-share">
              <Share2 size={22} color="white" />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`main-content ${!showEntry ? "content-visible" : ""}`}>
        {/* Navigation */}
        <nav className={`navbar ${isScrolled ? "navbar-scrolled" : ""}`}>
          <div className="container">
            <div className="navbar-brand">
              <div className="brand-logo">
                <Camera size={24} color="white" />
              </div>
              <span
                className={`brand-text ${
                  isScrolled ? "text-dark" : "text-light"
                }`}
              >
                Social Flow
              </span>
            </div>

            <div className="navbar-actions">
              <button
                className={`btn-login ${isScrolled ? "btn-dark" : "btn-light"}`}
                onClick={() => navigate("/login")} // <-- Add this
              >
                Log In
              </button>
              <button
                className="btn-signup"
                onClick={() => navigate("/register")} // <-- Add this
              >
                Sign Up
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="hero-section">
          <div className="container">
            <div className="hero-content">
              <div className="hero-text">
                <h1 className="hero-title">
                  Share Your
                  <span className="hero-highlight">Flow</span>
                </h1>
                <p className="hero-description">
                  Connect with friends, share your moments, and discover amazing
                  content in the most beautiful social experience ever created.
                </p>
                <div className="hero-actions">
                  <button className="btn-primary" onClick={() => navigate("/register")}>Get Started Free</button>
                </div>
              </div>

              {/* Phone Mockup */}
              <div className="hero-phone">
                <div className="phone-mockup">
                  <div className="phone-inner">
                    {/* Mock Interface */}
                    <div className="phone-header">
                      <div className="phone-header-content">
                        <h5 className="phone-title">Social Flow</h5>
                        <div className="phone-icons">
                          <Heart size={20} />
                          <MessageCircle size={20} />
                          <Share2 size={20} />
                        </div>
                      </div>
                    </div>

                    {/* Mock Post */}
                    <div className="phone-post">
                      <div className="post-header">
                        <div className="post-avatar"></div>
                        <span className="post-username">@yourname</span>
                      </div>
                      <div className="post-image">
                        <Camera
                          size={48}
                          color="white"
                          style={{ opacity: 0.8 }}
                        />
                      </div>
                      <div className="post-actions">
                        <Heart size={20} />
                        <MessageCircle size={20} />
                        <Share2 size={20} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="phone-floating-heart">
                  <Heart size={32} color="white" />
                </div>
                <div className="phone-floating-message">
                  <MessageCircle size={24} color="white" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="container">
            <div className="features-header">
              <h2 className="features-title">Why Choose Social Flow?</h2>
              <p className="features-description">
                Experience social media like never before with our cutting-edge
                features designed for the modern creator.
              </p>
            </div>

            <div className="features-grid">
              {features.map((feature, index) => (
                <div key={index} className="feature-card">
                  <div className="feature-icon">{feature.icon}</div>
                  <h4 className="feature-title">{feature.title}</h4>
                  <p className="feature-description">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-content">
              <h2 className="cta-title">Ready to Join the Flow?</h2>
              <p className="cta-description">
                Join millions of users who are already sharing their stories and
                connecting with friends on Social Flow.
              </p>
              <button className="cta-button" onClick={() => navigate("/register")}>Sign Up Now - It's Free!</button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="container">
            <div className="footer-content">
              <div className="footer-brand">
                <div className="footer-logo">
                  <Camera size={20} color="white" />
                </div>
                <h4 className="footer-title">Social Flow</h4>
              </div>

              <div className="footer-links">
                <a href="#" className="footer-link">
                  Privacy
                </a>
                <a href="#" className="footer-link">
                  Terms
                </a>
                <a href="#" className="footer-link">
                  Support
                </a>
                <a href="#" className="footer-link">
                  About
                </a>
              </div>

              <div className="footer-copyright">
                <p>&copy; 2025 Social Flow</p>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <style jsx>{`
        .app-container {
          position: relative;
          overflow-x: hidden;
        }

        /* Entry Animation Styles */
        .entry-screen {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 9999;
          overflow: hidden;
        }

        .entry-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            135deg,
            #667eea 0%,
            #764ba2 50%,
            #f093fb 100%
          );
        }

        .door-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
        }

        .door {
          width: 50%;
          height: 100%;
          background: linear-gradient(
            135deg,
            #1a1a2e 0%,
            #16213e 50%,
            #0f3460 100%
          );
          position: relative;
          transition: transform 2s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }

        .door-left {
          transform-origin: left center;
        }

        .door-right {
          transform-origin: right center;
        }

        .doors-opening .door-left {
          transform: perspective(1000px) rotateY(-90deg);
        }

        .doors-opening .door-right {
          transform: perspective(1000px) rotateY(90deg);
        }

        .door-content {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, #2d3436, #636e72);
          border: 8px solid #b2bec3;
          box-sizing: border-box;
        }

        .door-pattern {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 80px;
          height: 200px;
          border: 4px solid #ddd;
          border-radius: 8px;
          background: linear-gradient(45deg, #74b9ff, #0984e3);
          opacity: 0.3;
        }

        .door-pattern::before {
          content: "";
          position: absolute;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          width: 12px;
          height: 12px;
          background: #fff;
          border-radius: 50%;
        }

        .entry-logo {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          z-index: 10;
          transition: opacity 1s ease-in-out;
        }

        .logo-fade {
          opacity: 0;
        }

        .logo-container {
          animation: logoEntrance 2s ease-out;
        }

        .logo-icon {
          background: linear-gradient(45deg, #e91e63, #9c27b0);
          width: 120px;
          height: 120px;
          border-radius: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          box-shadow: 0 20px 40px rgba(233, 30, 99, 0.3);
          animation: iconFloat 3s ease-in-out infinite;
        }

        .logo-text {
          font-size: 3rem;
          font-weight: 900;
          color: white;
          margin: 0 0 10px 0;
          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          background: linear-gradient(45deg, #ffd700, #ff69b4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .logo-subtitle {
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 300;
          letter-spacing: 2px;
        }

        .skip-button {
          position: absolute;
          bottom: 40px;
          right: 40px;
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
          padding: 12px 24px;
          border-radius: 50px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .skip-button:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }

        .floating-elements {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .floating-heart {
          position: absolute;
          top: 20%;
          left: 15%;
          background: rgba(255, 255, 255, 0.2);
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: floatUpDown 4s ease-in-out infinite;
          backdrop-filter: blur(10px);
        }

        .floating-message {
          position: absolute;
          top: 60%;
          right: 20%;
          background: rgba(255, 255, 255, 0.2);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: floatUpDown 4s ease-in-out infinite 1s;
          backdrop-filter: blur(10px);
        }

        .floating-camera {
          position: absolute;
          top: 30%;
          right: 10%;
          background: rgba(255, 255, 255, 0.2);
          width: 70px;
          height: 70px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: floatUpDown 4s ease-in-out infinite 2s;
          backdrop-filter: blur(10px);
        }

        .floating-share {
          position: absolute;
          bottom: 30%;
          left: 10%;
          background: rgba(255, 255, 255, 0.2);
          width: 55px;
          height: 55px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: floatUpDown 4s ease-in-out infinite 0.5s;
          backdrop-filter: blur(10px);
        }

        /* Main Content Styles */
        .main-content {
          opacity: 0;
          transform: scale(0.9);
          transition: all 1s ease-in-out;
        }

        .main-content.content-visible {
          width: 100vw;
          max-width: 100vw;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .content-visible {
          opacity: 1;
          transform: scale(1);
        }

        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          padding: 1rem 50px 0;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .navbar-scrolled {
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
        }

        .container {
          width: 100%; /* Make container full width */
          max-width: none; /* Remove max-width */
          margin: 0; /* Remove auto margin */
          padding: 0 20px; /* Optional: keep horizontal padding */
        }

        .navbar .container {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .navbar-brand {
          display: flex;
          align-items: center;
        }

        .brand-logo {
          background: linear-gradient(45deg, #e91e63, #9c27b0);
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 12px;
        }

        .brand-text {
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
          transition: color 0.3s ease;
        }

        .text-dark {
          color: #333 !important;
        }

        .text-light {
          color: white !important;
        }

        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .btn-login {
          background: none;
          border: none;
          color: white;
          font-weight: 600;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-login.btn-dark {
          color: #333;
        }

        .btn-signup {
          background: linear-gradient(45deg, #e91e63, #9c27b0);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 50px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-signup:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(233, 30, 99, 0.3);
        }

        .hero-section {
          background: linear-gradient(
            135deg,
            #667eea 0%,
            #764ba2 50%,
            #f093fb 100%
          );
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding-top: 80px;
        }

        .hero-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          padding: 70px;
          align-items: center;
          min-height: 80vh;
        }

        .hero-title {
          font-size: 4rem;
          font-weight: 900;
          color: white;
          margin-bottom: 1.5rem;
          line-height: 1.1;
        }

        .hero-highlight {
          display: block;
          background: linear-gradient(45deg, #ffd700, #ff69b4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-description {
          font-size: 1.25rem;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .btn-primary {
          background: white;
          color: #9c27b0;
          border: none;
          padding: 18px 36px;
          border-radius: 50px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .hero-phone {
          display: flex;
          justify-content: center;
          position: relative;
        }

        .phone-mockup {
          background: linear-gradient(145deg, #1a1a1a, #000);
          border-radius: 30px;
          padding: 8px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          transform: rotate(3deg);
          transition: all 0.5s ease;
          max-width: 300px;
          animation: phoneFloat 6s ease-in-out infinite;
        }

        .phone-mockup:hover {
          transform: rotate(0deg);
        }

        .phone-inner {
          background: white;
          border-radius: 22px;
          overflow: hidden;
          height: 400px;
        }

        .phone-header {
          padding: 1rem;
          border-bottom: 1px solid #eee;
        }

        .phone-header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .phone-title {
          font-weight: 700;
          font-size: 1rem;
          margin: 0;
        }

        .phone-icons {
          display: flex;
          gap: 1rem;
        }

        .phone-post {
          padding: 1rem;
        }

        .post-header {
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
        }

        .post-avatar {
          width: 32px;
          height: 32px;
          background: linear-gradient(45deg, #e91e63, #9c27b0);
          border-radius: 50%;
          margin-right: 8px;
        }

        .post-username {
          font-weight: 600;
          font-size: 0.9rem;
        }

        .post-image {
          background: linear-gradient(135deg, #667eea, #764ba2);
          height: 200px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
        }

        .post-actions {
          display: flex;
          gap: 1rem;
          color: #666;
        }

        .phone-floating-heart {
          position: absolute;
          top: -20px;
          left: -20px;
          background: #ffd700;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: bounce 2s infinite;
          box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3);
        }

        .phone-floating-message {
          position: absolute;
          bottom: -20px;
          right: -20px;
          background: #e91e63;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: pulse 2s infinite;
          box-shadow: 0 5px 15px rgba(233, 30, 99, 0.3);
        }

        .features-section {
          padding: 5rem 5rem;
          background: #f8f9fa;
        }

        .features-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .features-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #333;
          margin-bottom: 1rem;
        }

        .features-description {
          font-size: 1.1rem;
          color: #666;
          max-width: 600px;
          margin: 0 auto;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .feature-card {
          background: white;
          padding: 2rem;
          border-radius: 20px;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .feature-icon {
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: white;
          width: 80px;
          height: 80px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
        }

        .feature-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: #333;
          margin-bottom: 1rem;
        }

        .feature-description {
          color: #666;
          line-height: 1.6;
        }

        .cta-section {
          background: linear-gradient(135deg, #667eea, #764ba2);
          padding: 5rem 0;
        }

        .cta-content {
          text-align: center;
        }

        .cta-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: white;
          margin-bottom: 1rem;
        }

        .cta-description {
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 2rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .cta-button {
          background: white;
          color: #9c27b0;
          border: none;
          padding: 18px 36px;
          border-radius: 50px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .footer {
          background: #333;
          color: white;
          padding: 3rem 3rem;
        }

        .footer-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 2rem;
        }

        .footer-brand {
          display: flex;
          align-items: center;
        }

        .footer-logo {
          background: linear-gradient(45deg, #e91e63, #9c27b0);
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 12px;
        }

        .footer-title {
          font-weight: 700;
          margin: 0;
        }

        .footer-links {
          display: flex;
          gap: 2rem;
        }

        .footer-link {
          color: #ccc;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .footer-link:hover {
          color: white;
        }

        .footer-copyright {
          color: #ccc;
        }

        .footer-copyright p {
          margin: 0;
        }

        /* Animations */
        @keyframes logoEntrance {
          0% {
            opacity: 0;
            transform: scale(0.5) rotate(-10deg);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.1) rotate(5deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }

        @keyframes iconFloat {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes floatUpDown {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes phoneFloat {
          0%,
          100% {
            transform: rotate(3deg) translateY(0px);
          }
          50% {
            transform: rotate(3deg) translateY(-10px);
          }
        }

        @keyframes bounce {
          0%,
          20%,
          50%,
          80%,
          100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-30px);
          }
          60% {
            transform: translateY(-15px);
          }
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .hero-content {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 2rem;
          }

          .hero-title {
            font-size: 2.5rem;
          }

          .hero-description {
            font-size: 1rem;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .footer-content {
            flex-direction: column;
            text-align: center;
          }

          .footer-links {
            flex-wrap: wrap;
            justify-content: center;
          }

          .skip-button {
            bottom: 20px;
            right: 20px;
            padding: 8px 16px;
            font-size: 0.9rem;
          }

          .logo-text {
            font-size: 2rem;
          }

          .logo-subtitle {
            font-size: 1rem;
          }

          .floating-elements > div {
            width: 40px;
            height: 40px;
          }

          .floating-camera {
            width: 50px !important;
            height: 50px !important;
          }

          .phone-mockup {
            max-width: 250px;
          }

          .phone-inner {
            height: 350px;
          }

          .post-image {
            height: 150px;
          }
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: 2rem;
          }

          .features-title {
            font-size: 2rem;
          }

          .cta-title {
            font-size: 2rem;
          }

          .container {
            padding: 0 15px;
          }

          .navbar {
            padding: 0.8rem 0;
          }

          .brand-text {
            font-size: 1.2rem;
          }

          .door-pattern {
            width: 60px;
            height: 150px;
          }

          .logo-icon {
            width: 80px;
            height: 80px;
          }

          .floating-heart {
            width: 40px;
            height: 40px;
          }

          .floating-message {
            width: 35px;
            height: 35px;
          }

          .floating-camera {
            width: 45px !important;
            height: 45px !important;
          }

          .floating-share {
            width: 40px;
            height: 40px;
          }
        }
      `}</style>
    </div>
  );
}
