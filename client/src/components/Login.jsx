import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { User, Mail, Lock, Eye, EyeOff, UserPlus, LogIn, Stars } from 'lucide-react';

// Login Component
const Login = () => {
  const [credentials, setCredentials] = useState({
    emailOrUsername: '',
    password: '',
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
      // Replace with actual API call
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });
      if (!response.ok) {
        throw new Error('Login failed');
      }
      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.href = '/';
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 position-relative overflow-hidden" style={{
      background: `
        radial-gradient(ellipse at ${mousePosition.x}% ${mousePosition.y}%, rgba(147, 51, 234, 0.1) 0%, transparent 50%),
        radial-gradient(ellipse at 20% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 20%, rgba(236, 72, 153, 0.1) 0%, transparent 50%),
        linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #0f172a 50%, #1e1b4b 75%, #0f172a 100%)
      `
    }}>
      {/* Animated Stars */}
      <div className="position-absolute w-100 h-100">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="position-absolute rounded-circle bg-white"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              opacity: Math.random() * 0.8 + 0.2,
              animation: `twinkle ${Math.random() * 4 + 2}s ease-in-out infinite alternate`
            }}
          />
        ))}
      </div>

      {/* Mountain Silhouette */}
      <div className="position-absolute bottom-0 w-100" style={{
        height: '40%',
        background: `
          linear-gradient(to right, 
            rgba(15, 23, 42, 0.9) 0%, 
            rgba(30, 41, 59, 0.8) 25%, 
            rgba(15, 23, 42, 0.9) 50%,
            rgba(30, 27, 75, 0.8) 75%,
            rgba(15, 23, 42, 0.9) 100%
          )
        `,
        clipPath: 'polygon(0 100%, 0 60%, 10% 50%, 20% 70%, 30% 40%, 40% 60%, 50% 30%, 60% 50%, 70% 35%, 80% 55%, 90% 45%, 100% 65%, 100% 100%)'
      }} />

      {/* Shooting Stars */}
      <div className="position-absolute" style={{
        top: '20%',
        left: '10%',
        width: '100px',
        height: '2px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
        animation: 'shootingStar 3s ease-in-out infinite',
        animationDelay: '1s'
      }} />

      <div className="position-absolute" style={{
        top: '40%',
        right: '20%',
        width: '80px',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(147, 51, 234, 0.6), transparent)',
        animation: 'shootingStar 4s ease-in-out infinite',
        animationDelay: '3s'
      }} />

      {/* Login Form */}
      <div className="container d-flex align-items-center justify-content-center min-vh-100 position-relative" style={{ zIndex: 10 }}>
        <div className="col-md-6 col-lg-4">
          <div className="p-5 rounded-4 position-relative" style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
          }}>
            {/* Cosmic glow effect */}
            <div className="position-absolute top-0 start-0 w-100 h-100 rounded-4" style={{
              background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(59, 130, 246, 0.1))',
              zIndex: -1
            }} />

            <div className="text-center mb-4">
              <div className="d-inline-flex align-items-center justify-content-center mb-3" style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                borderRadius: '50%'
              }}>
                <Stars className="text-white" size={24} />
              </div>
              <h2 className="fw-bold text-white mb-2">Welcome Back</h2>
              <p className="text-white-50">Sign in to your cosmic journey</p>
            </div>
            
            {error && (
              <div className="alert alert-danger bg-danger bg-opacity-10 border-danger text-danger">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-3 position-relative">
                <div className="position-absolute top-50 start-0 translate-middle-y ms-3" style={{ zIndex: 5 }}>
                  <User className="text-white-50" size={20} />
                </div>
                <input
                  type="text"
                  className="form-control ps-5 py-3"
                  placeholder="Email or Username"
                  name="emailOrUsername"
                  value={credentials.emailOrUsername}
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

              <div className="mb-4 position-relative">
                <div className="position-absolute top-50 start-0 translate-middle-y ms-3" style={{ zIndex: 5 }}>
                  <Lock className="text-white-50" size={20} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control ps-5 pe-5 py-3"
                  placeholder="Password"
                  name="password"
                  value={credentials.password}
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

              <button 
                type="submit" 
                className="btn w-100 py-3 fw-semibold text-white rounded-3 d-flex align-items-center justify-content-center gap-2"
                disabled={loading}
                style={{
                  background: loading ? 'rgba(139, 92, 246, 0.6)' : 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                  border: 'none',
                  transition: 'all 0.3s ease'
                }}
              >
                <LogIn size={20} />
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <div className="text-center mt-4">
              <p className="text-white-50 mb-2">Don't have an account?</p>
              <button 
                className="btn text-white fw-semibold"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px'
                }}
                onClick={() => { window.location.href = '/register'; }}
              >
                Create Account
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
        
        @keyframes shootingStar {
          0% { 
            opacity: 0; 
            transform: translateX(-100px) translateY(0px); 
          }
          10% { 
            opacity: 1; 
          }
          90% { 
            opacity: 1; 
          }
          100% { 
            opacity: 0; 
            transform: translateX(300px) translateY(-50px); 
          }
        }
        
        input::placeholder {
          color: rgba(255, 255, 255, 0.5) !important;
        }
        
        input:focus {
          background: rgba(255, 255, 255, 0.15) !important;
          border-color: rgba(139, 92, 246, 0.5) !important;
          box-shadow: 0 0 0 0.2rem rgba(139, 92, 246, 0.25) !important;
        }
      `}</style>
    </div>
  );
};
export default Login;