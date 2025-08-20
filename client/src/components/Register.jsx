import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { User, Mail, Lock, Eye, EyeOff, UserPlus, LogIn, Stars } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const Register = () => {
     const navigate = useNavigate();
  
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
    gender: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Replace with actual API call
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        throw new Error('Registration failed');
      }
      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate("/");
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 position-relative overflow-hidden" style={{
      background: `
        radial-gradient(ellipse at ${mousePosition.x}% ${mousePosition.y}%, rgba(236, 72, 153, 0.1) 0%, transparent 50%),
        radial-gradient(ellipse at 20% 20%, rgba(147, 51, 234, 0.15) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
        linear-gradient(135deg, #0f172a 0%, #1e1b4b 25%, #0f172a 50%, #1e293b 75%, #0f172a 100%)
      `
    }}>
      {/* Animated Stars */}
      <div className="position-absolute w-100 h-100">
        {[...Array(60)].map((_, i) => (
          <div
            key={i}
            className="position-absolute rounded-circle"
            style={{
              width: Math.random() * 4 + 1 + 'px',
              height: Math.random() * 4 + 1 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              background: ['#ffffff', '#8b5cf6', '#3b82f6', '#ec4899'][Math.floor(Math.random() * 4)],
              opacity: Math.random() * 0.8 + 0.2,
              animation: `twinkle ${Math.random() * 5 + 2}s ease-in-out infinite alternate`
            }}
          />
        ))}
      </div>

      {/* Mountain Silhouette */}
      <div className="position-absolute bottom-0 w-100" style={{
        height: '45%',
        background: `
          linear-gradient(to right, 
            rgba(15, 23, 42, 0.9) 0%, 
            rgba(30, 27, 75, 0.8) 25%, 
            rgba(15, 23, 42, 0.9) 50%,
            rgba(30, 41, 59, 0.8) 75%,
            rgba(15, 23, 42, 0.9) 100%
          )
        `,
        clipPath: 'polygon(0 100%, 0 65%, 15% 55%, 25% 75%, 35% 45%, 45% 65%, 55% 35%, 65% 55%, 75% 40%, 85% 60%, 95% 50%, 100% 70%, 100% 100%)'
      }} />

      {/* Galaxy Swirl */}
      <div className="position-absolute top-0 end-0" style={{
        width: '300px',
        height: '300px',
        background: 'radial-gradient(ellipse, rgba(147, 51, 234, 0.3), rgba(236, 72, 153, 0.2), transparent)',
        borderRadius: '50%',
        animation: 'rotate 20s linear infinite'
      }} />

      {/* Register Form */}
      <div className="container d-flex align-items-center justify-content-center min-vh-100 position-relative py-5" style={{ zIndex: 10 }}>
        <div className="col-md-8 col-lg-6">
          <div className="p-5 rounded-4 position-relative" style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
          }}>
            {/* Cosmic glow effect */}
            <div className="position-absolute top-0 start-0 w-100 h-100 rounded-4" style={{
              background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(147, 51, 234, 0.1))',
              zIndex: -1
            }} />

            <div className="text-center mb-4">
              <div className="d-inline-flex align-items-center justify-content-center mb-3" style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                borderRadius: '50%'
              }}>
                <UserPlus className="text-white" size={24} />
              </div>
              <h2 className="fw-bold text-white mb-2">Join the SocialFlow</h2>
              <p className="text-white-50">Create your account and explore the universe</p>
            </div>
            
            {error && (
              <div className="alert alert-danger bg-danger bg-opacity-10 border-danger text-danger">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <div className="position-relative">
                    <div className="position-absolute top-50 start-0 translate-middle-y ms-3" style={{ zIndex: 5 }}>
                      <Mail className="text-white-50" size={20} />
                    </div>
                    <input
                      type="email"
                      className="form-control ps-5 py-3"
                      placeholder="Email"
                      name="email"
                      value={userData.email}
                      onChange={handleChange}
                      required
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        borderRadius: '12px'
                      }}
                    />
                  </div>
                </div>

                <div className="col-md-6 mb-3">
                  <div className="position-relative">
                    <div className="position-absolute top-50 start-0 translate-middle-y ms-3" style={{ zIndex: 5 }}>
                      <User className="text-white-50" size={20} />
                    </div>
                    <input
                      type="text"
                      className="form-control ps-5 py-3"
                      placeholder="Username"
                      name="username"
                      value={userData.username}
                      onChange={handleChange}
                      required
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        borderRadius: '12px'
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="mb-3 position-relative">
                <div className="position-absolute top-50 start-0 translate-middle-y ms-3" style={{ zIndex: 5 }}>
                  <Lock className="text-white-50" size={20} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control ps-5 pe-5 py-3"
                  placeholder="Password"
                  name="password"
                  value={userData.password}
                  onChange={handleChange}
                  required
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    borderRadius: '12px'
                  }}
                />
                <button
                  type="button"
                  className="btn position-absolute top-50 end-0 translate-middle-y me-3"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ zIndex: 5, border: 'none', background: 'transparent' }}
                >
                  {showPassword ? <EyeOff className="text-white-50" size={20} /> : <Eye className="text-white-50" size={20} />}
                </button>
              </div>

              <div className="mb-4">
                <select
                  className="form-select py-3"
                  name="gender"
                  value={userData.gender}
                  onChange={handleChange}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    borderRadius: '12px'
                  }}
                >
                  <option value="">Select Gender (Optional)</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <button 
                type="submit" 
                className="btn w-100 py-3 fw-semibold text-white rounded-3 d-flex align-items-center justify-content-center gap-2"
                disabled={loading}
                style={{
                  background: loading ? 'rgba(236, 72, 153, 0.6)' : 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                  border: 'none',
                  transition: 'all 0.3s ease'
                }}
              >
                <UserPlus size={20} />
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div className="text-center mt-4">
              <small className="text-white-50 d-block mb-3">
                By signing up, you agree to our Terms, Data Policy and Cookies Policy.
              </small>
              <p className="text-white-50 mb-2">Already have an account?</p>
              <button 
                className="btn text-white fw-semibold"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px'
                }}
                onClick={() => navigate("/login")}
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes twinkle {
          0% { opacity: 0.2; transform: scale(1); }
          100% { opacity: 1; transform: scale(1.2); }
        }
        
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        input::placeholder, select {
          color: rgba(255, 255, 255, 0.5) !important;
        }
        
        input:focus, select:focus {
          background: rgba(255, 255, 255, 0.15) !important;
          border-color: rgba(236, 72, 153, 0.5) !important;
          box-shadow: 0 0 0 0.2rem rgba(236, 72, 153, 0.25) !important;
        }
        
        select option {
          background: #1e293b;
          color: white;
        }
      `}</style>
    </div>
  );
};
export default Register;