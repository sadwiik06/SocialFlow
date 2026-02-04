import React, { useState, useEffect } from "react";
import {
  Camera,
  Heart,
  MessageCircle,
  Share2,
  Users,
  Play,
  ChevronRight,
  ArrowDown
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SocialFlowHomepage() {
  const navigate = useNavigate();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div className="artisan-wrapper">
      {/* Background Canvas: Subtle Dot Grid */}
      <div className="dot-canvas"></div>

      {/* Minimal Floating Nav */}
      <nav className="artisan-nav">
        <div className="nav-logo" onClick={() => navigate("/")}>SF.</div>
        <div className="nav-links">
          <button className="nav-btn-muted" onClick={() => navigate("/login")}>Login</button>
          <button className="nav-btn-solid" onClick={() => navigate("/register")}>Enter</button>
        </div>
      </nav>

      <main>
        {/* The Creative Hero: Centered Text + Floating Snippets */}
        <section className="creative-hero">
          <div className="hero-center-content">
            <span className="hero-micro-label">SOCIAL MEDIA REDEFINED</span>
            <h1 className="hero-headline">
              Create. <br />
              <span className="outline-serif text-accent">Connect.</span> <br />
              Share.
            </h1>
            <p className="hero-subtitle-minimal">
              A clean space for your world. <br /> No noise, just your content.
            </p>
            <div className="btn-hero-container">
              <button className="btn-cta-minimal" onClick={() => navigate("/register")}>
                Get Started <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Floating Artisan Snapshots with Parallax */}
          <div className="floating-snapshots">
            <div className="snap item-1" style={{ transform: `translate(${mousePos.x / 40}px, ${mousePos.y / 40}px) rotate(10deg)` }}>
              <div className="snap-inner">
                <div className="snap-img vid-mock">
                  <Play size={20} fill="white" />
                </div>
                <div className="snap-label">REELS</div>
              </div>
            </div>
            <div className="snap item-2" style={{ transform: `translate(${-mousePos.x / 50}px, ${-mousePos.y / 50}px) rotate(-8deg)` }}>
              <div className="snap-inner">
                <div className="snap-header">
                  <div className="user-av"></div>
                </div>
                <div className="snap-img post-mock"></div>
                <div className="snap-footer">
                  <Heart size={12} fill="#ff4d4d" stroke="none" />
                </div>
              </div>
            </div>
            <div className="snap item-3" style={{ transform: `translate(${mousePos.x / 30}px, ${-mousePos.y / 30}px) rotate(-15deg)` }}>
              <div className="snap-inner">
                <div className="notif-pill">
                  <div className="av-sm"></div>
                  <span>New follower</span>
                </div>
              </div>
            </div>
            <div className="snap item-4" style={{ transform: `translate(${-mousePos.x / 60}px, ${mousePos.y / 60}px) rotate(5deg)` }}>
              <div className="snap-inner">
                <div className="stat-pill">
                  <span className="num">2.4k</span>
                  <span className="lab">VIEWS</span>
                </div>
              </div>
            </div>
          </div>

          <div className="scroll-hint">
            <ArrowDown size={20} />
          </div>
        </section>

        {/* Feature Strip: Horizontal & Minimal */}
        <section className="feature-strip">
          <div className="strip-container">
            <div className="strip-box">
              <Camera size={24} />
              <h4>High Quality Media</h4>
            </div>
            <div className="strip-divider"></div>
            <div className="strip-box">
              <Play size={24} />
              <h4>Smooth Reels</h4>
            </div>
            <div className="strip-divider"></div>
            <div className="strip-box">
              <Users size={24} />
              <h4>Pure Social</h4>
            </div>
          </div>
        </section>

        {/* The "Statement" Section: Wide Typography */}
        <section className="artisan-statement">
          <div className="statement-container">
            <h2 className="statement-big">
              WE     REMOVED  THE <span className="italic"> CLUTTER</span> SO  YOU  CAN  FOCUS  ON  THE <span className="text-accent underline">FLOW</span>.
            </h2>
          </div>
        </section>

        {/* Final Minimal CTA */}
        <section className="final-cta-artisan">
          <div className="container-sm">
            <button className="btn-huge" onClick={() => navigate("/register")}>
              JOIN SOCIALFLOW
            </button>
          </div>
        </section>
      </main>

      <footer className="artisan-footer">
        <div className="footer-inner-artisan">
          <div className="brand">SocialFlow</div>
          <div className="links">
            <a href="#">Terms</a>
            <a href="#">Privacy</a>
          </div>
          <div className="copy">© 2026 Crafted for you.</div>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Italiana&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

        :root {
          --bg: #ffffff;
          --text: #000000;
          --text-muted: #666666;
          --accent: #007aff; 
          --font: 'Plus Jakarta Sans', sans-serif;
          --font-serif: 'Italiana', serif;
        }

        * { 
          box-sizing: border-box; 
          margin: 0; 
          padding: 0; 
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
        }

        .artisan-wrapper {
          background-color: var(--bg);
          color: var(--text);
          font-family: var(--font);
          overflow-x: hidden;
        }

        /* Dot Grid Canvas */
        .dot-canvas {
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          background-image: radial-gradient(#efefef 1px, transparent 1px);
          background-size: 40px 40px;
          z-index: -1;
          opacity: 0.5;
        }

        /* Nav */
        .artisan-nav {
          position: fixed;
          top: 0; left: 0; width: 100%;
          padding: 30px 60px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 1000;
        }

        .nav-logo {
          font-weight: 900;
          font-size: 24px;
          letter-spacing: -2px;
          cursor: pointer;
        }

        .nav-links { display: flex; gap: 40px; align-items: center; }

        .nav-btn-muted {
          background: none; border: none; font-weight: 600; font-size: 14px; color: var(--text-muted); cursor: pointer;
        }

        .nav-btn-solid {
          background: var(--text); color: white; border: none; padding: 8px 18px; border-radius: 4px; font-weight: 700; font-size: 14px; cursor: pointer;
        }

        /* Creative Hero */
        .creative-hero {
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          position: relative;
        }

        .hero-center-content {
          opacity: 0;
          animation: fluidReveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .hero-micro-label {
          font-size: 11px; 
          font-weight: 800; 
          letter-spacing: 0.4em; 
          color: var(--accent); 
          margin-bottom: 32px; 
          display: block;
          text-transform: uppercase;
        }

        .hero-headline {
          font-size: clamp(100px, 18vw, 280px); 
          font-weight: 800; 
          line-height: 0.8; 
          letter-spacing: -0.075em; 
          margin-bottom: 56px;
          text-wrap: balance;
          color: #000;
          text-shadow: 0 5px 15px rgba(0,0,0,0.03);
        }

        .outline-serif {
          font-family: var(--font-serif);
          font-weight: 400;
          font-style: italic;
          letter-spacing: -0.03em;
          padding: 0 12px;
          opacity: 0.9;
        }

        .text-accent { color: var(--accent); }

        .hero-subtitle-minimal {
          font-size: clamp(18px, 2vw, 22px); 
          color: var(--text-muted); 
          font-weight: 400; 
          margin-bottom: 60px; 
          line-height: 1.6;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .btn-hero-container {
          display: flex;
          justify-content: center;
          width: 100%;
        }

        .btn-cta-minimal {
          background: var(--accent); 
          color: white; 
          border: none; 
          padding: 18px 48px; 
          border-radius: 99px; 
          font-weight: 700; 
          font-size: 18px; 
          cursor: pointer;
          display: flex; 
          align-items: center; 
          gap: 12px; 
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 10px 30px rgba(0, 122, 255, 0.2);
        }

        .btn-cta-minimal:hover { 
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 15px 40px rgba(0, 122, 255, 0.3);
        }

        /* Floating Artisan Snapshots */
        .floating-snapshots {
           position: absolute;
           top: 0; left: 0; width: 100%; height: 100%;
           pointer-events: none;
           z-index: -1;
        }

        .snap {
           position: absolute;
           background: rgba(255, 255, 255, 0.95);
           backdrop-filter: blur(20px);
           padding: 12px;
           border-radius: 20px;
           box-shadow: 0 40px 100px rgba(0,0,0,0.1);
           border: 1px solid rgba(0,0,0,0.03);
           transition: transform 0.1s linear, box-shadow 0.3s ease;
           will-change: transform;
        }

        .snap:hover {
           box-shadow: 0 60px 130px rgba(0,0,0,0.15);
           z-index: 10;
        }

        .item-1 { top: 15%; right: 10%; transform: rotate(10deg); width: 160px; height: 220px; }
        .item-2 { bottom: 15%; left: 8%; transform: rotate(-8deg); width: 200px; height: 260px; }
        .item-3 { top: 20%; left: 12%; transform: rotate(-15deg); }
        .item-4 { bottom: 20%; right: 15%; transform: rotate(5deg); }

        .snap-img { width: 100%; border-radius: 8px; }
        .vid-mock { height: 160px; background: linear-gradient(135deg, #eee, #f9f9f9); display: flex; align-items: center; justify-content: center; }
        .post-mock { height: 180px; background: #fafafa; }

        .snap-label { font-size: 9px; font-weight: 800; color: #ccc; margin-top: 10px; letter-spacing: 1px; }

        .snap-header { display: flex; padding-bottom: 8px; }
        .user-av { width: 16px; height: 16px; background: #eee; border-radius: 50%; }

        .snap-footer { padding-top: 8px; }

        .notif-pill { display: flex; align-items: center; gap: 10px; padding: 10px 20px; }
        .av-sm { width: 24px; height: 24px; background: #eee; border-radius: 50%; }
        .notif-pill span { font-size: 12px; font-weight: 700; }

        .stat-pill { display: flex; flex-direction: column; align-items: center; padding: 15px 25px; }
        .stat-pill .num { font-size: 20px; font-weight: 800; }
        .stat-pill .lab { font-size: 8px; color: var(--text-muted); letter-spacing: 2px; }

        .scroll-hint { position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%); color: #ccc; }

        /* Feature Strip */
        .feature-strip { padding: 60px 0; border-top: 1px solid #f5f5f5; border-bottom: 1px solid #f5f5f5; }
        .strip-container { display: flex; justify-content: center; align-items: center; gap: 80px; }
        .strip-box { display: flex; align-items: center; gap: 15px; }
        .strip-box h4 { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
        .strip-divider { width: 1px; height: 30px; background: #eee; }

        /* Statement */
        .artisan-statement { padding: 180px 60px; text-align: center; }
        .statement-container { max-width: 1100px; margin: 0 auto; }
        .statement-big { 
          font-size: clamp(40px, 8vw, 90px); 
          font-weight: 800; 
          line-height: 0.95; 
          letter-spacing: -0.05em; 
          text-wrap: balance;
        }
        .italic { font-family: var(--font-serif); font-weight: 400; font-style: italic; color: var(--text-muted); }
        .underline { border-bottom: 4px solid var(--accent); }

        /* Final CTA */
        .final-cta-artisan { padding: 100px 0 200px; text-align: center; }
        .btn-huge {
           background: var(--text); color: white; border: none; padding: 30px 60px; font-size: 24px; font-weight: 900; letter-spacing: -1px; cursor: pointer; transition: all 0.3s;
        }
        .btn-huge:hover { transform: scale(1.05); border-radius: 20px; }

        /* Footer */
        .artisan-footer { padding: 60px; border-top: 1px solid #f5f5f5; }
        .footer-inner-artisan { display: flex; justify-content: space-between; align-items: center; font-size: 13px; font-weight: 600; }
        .brand { font-weight: 800; font-size: 18px; }
        .links { display: flex; gap: 30px; }
        .links a { color: var(--text-main); text-decoration: none; }
        .copy { color: var(--text-muted); }

        @media (max-width: 1024px) {
           .hero-headline { font-size: 80px; }
           .statement-big { font-size: 50px; }
           .floating-snapshots { display: none; }
           .strip-container { flex-direction: column; gap: 40px; }
           .strip-divider { display: none; }
        }

        @keyframes fluidReveal {
          from { opacity: 0; transform: translateY(40px) scale(0.98); filter: blur(10px); }
          to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }

        @keyframes subtleFloating {
           0%, 100% { transform: translateY(0); }
           50% { transform: translateY(-15px); }
        }
           .artisan-nav { padding: 20px; }
           .hero-headline { font-size: 120px; }
           .artisan-statement { padding: 80px 20px; }
           .btn-huge { padding: 20px 40px; font-size: 18px; }
           .footer-inner-artisan { flex-direction: column; gap: 30px; }
        }
      `}</style>
    </div>
  );
}
