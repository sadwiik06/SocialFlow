import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn, ChevronLeft } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    emailOrUsername: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg || 'Login failed');
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate("/");
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="artisan-auth-wrapper">
      <div className="dot-canvas"></div>

      <button className="back-btn" onClick={() => navigate("/")}>
        <ChevronLeft size={20} /> Back
      </button>

      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <span className="auth-label">WELCOME BACK</span>
            <h2 className="auth-title">Log <span className="italic-serif">In</span></h2>
            <p className="auth-subtitle">Continue your flow.</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group-minimal">
              <Mail className="input-icon" size={18} />
              <input
                type="text"
                placeholder="Email or Username"
                name="emailOrUsername"
                value={credentials.emailOrUsername}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group-minimal">
              <Lock className="input-icon" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="eye-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              className="btn-auth-submit"
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Sign In'} <LogIn size={18} />
            </button>
          </form>

          <div className="auth-footer">
            <p>New here?</p>
            <button className="auth-link-btn" onClick={() => navigate("/register")}>
              Create an account
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Italiana&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

        :root {
          --bg: #ffffff;
          --text: #000000;
          --text-muted: #888888;
          --accent: #007aff;
          --error: #ff4d4d;
          --font: 'Plus Jakarta Sans', sans-serif;
          --font-serif: 'Italiana', serif;
        }

        .artisan-auth-wrapper {
          min-height: 100vh;
          background-color: var(--bg);
          color: var(--text);
          font-family: var(--font);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .dot-canvas {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          background-image: radial-gradient(#efefef 1px, transparent 1px);
          background-size: 40px 40px;
          z-index: 0;
        }

        .back-btn {
          position: absolute;
          top: 40px; left: 40px;
          background: none; border: none;
          display: flex; align-items: center; gap: 8px;
          font-weight: 700; font-size: 14px; color: var(--text-muted);
          cursor: pointer; z-index: 10;
          transition: color 0.2s;
        }
        .back-btn:hover { color: var(--text); }

        .auth-container {
          width: 100%;
          max-width: 420px;
          padding: 20px;
          position: relative;
          z-index: 1;
        }

        .auth-card {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(24px);
          padding: 48px;
          border-radius: 32px;
          box-shadow: 0 40px 100px rgba(0,0,0,0.05);
          border: 1px solid rgba(255, 255, 255, 0.4);
          animation: fluidReveal 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .auth-header { text-align: center; margin-bottom: 48px; }
        .auth-label { 
          font-size: 11px; 
          font-weight: 800; 
          letter-spacing: 0.4em; 
          color: var(--accent); 
          margin-bottom: 20px; 
          display: block; 
          text-transform: uppercase;
          opacity: 0.8;
        }
        .auth-title { 
          font-size: clamp(48px, 10vw, 64px); 
          font-weight: 800; 
          letter-spacing: -0.05em; 
          margin-bottom: 16px; 
          line-height: 0.9; 
        }
        .italic-serif { 
          font-family: var(--font-serif); 
          font-weight: 400; 
          font-style: italic; 
          color: var(--text-muted); 
          padding: 0 4px; 
          opacity: 0.85;
        }
        .auth-subtitle { font-size: 15px; color: var(--text-muted); font-weight: 400; letter-spacing: -0.01em; }

        .auth-error {
          background: rgba(255, 77, 77, 0.05);
          color: var(--error);
          padding: 12px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 24px;
          border: 1px solid rgba(255, 77, 77, 0.1);
          text-align: center;
        }

        .auth-form { display: flex; flex-direction: column; gap: 20px; }

        .input-group-minimal {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 16px;
          color: #ccc;
        }

        .input-group-minimal input {
          width: 100%;
          padding: 16px 16px 16px 48px;
          border: 1px solid #eee;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 500;
          transition: all 0.2s;
          background: #fafafa;
        }

        .input-group-minimal input:focus {
          outline: none;
          background: white;
          border-color: var(--accent);
          box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.05);
        }

        .eye-toggle {
          position: absolute;
          right: 16px;
          background: none; border: none;
          color: #ccc; cursor: pointer;
        }

        .btn-auth-submit {
          background: var(--text);
          color: white;
          border: none;
          padding: 18px;
          border-radius: 12px;
          font-weight: 800;
          font-size: 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          transition: all 0.3s;
          margin-top: 10px;
        }

        .btn-auth-submit:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
        .btn-auth-submit:disabled { opacity: 0.5; cursor: not-allowed; }

        .auth-footer {
          margin-top: 40px;
          text-align: center;
          font-size: 14px;
          color: var(--text-muted);
        }

        .auth-link-btn {
          background: none; border: none;
          color: var(--text);
          font-weight: 800;
          cursor: pointer;
          margin-top: 5px;
          text-decoration: underline;
        }

        @keyframes fluidReveal {
          from { opacity: 0; transform: translateY(30px) scale(0.98); filter: blur(10px); }
          to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }

        @media (max-width: 480px) {
          .auth-card { padding: 30px 20px; }
          .auth-title { font-size: 36px; }
        }
      `}</style>
    </div>
  );
};

export default Login;