import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function VideoHero() {
  const [muted, setMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        setVideoError(true);
      });
    }
  }, [videoError]);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  return (
    <div className="video-hero">
      {!videoError ? (
        <video
          ref={videoRef}
          className="video-hero-video"
          autoPlay
          muted
          loop
          playsInline
          poster="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1920&auto=format&fit=crop"
          onError={() => setVideoError(true)}
        >
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-woman-in-a-fashion-show-1163-large.mp4"
            type="video/mp4"
          />
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-model-in-a-fashion-show-1165-large.mp4"
            type="video/mp4"
          />
        </video>
      ) : (
        <img
          className="video-hero-fallback"
          src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1920&auto=format&fit=crop"
          alt="Vogue Plaza — Luxury Fashion"
        />
      )}

      {/* Dark overlay */}
      <div className="video-hero-overlay" />

      {/* Content */}
      <div className="video-hero-content">
        <span className="video-hero-eyebrow">Summer 2026</span>
        <h1 className="video-hero-title">The New Season</h1>
        <p className="video-hero-subtitle">Discover the world's finest luxury fashion, curated for you.</p>
        <div className="video-hero-actions">
          <Link to="/products?category=womenswear" className="video-hero-cta primary">
            Shop Women
          </Link>
          <Link to="/products?category=menswear" className="video-hero-cta secondary">
            Shop Men
          </Link>
        </div>
      </div>

      {/* Mute toggle */}
      {!videoError && (
        <button className="video-hero-mute-btn" onClick={toggleMute} aria-label={muted ? 'Unmute' : 'Mute'}>
          {muted ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <line x1="23" y1="9" x2="17" y2="15"/>
              <line x1="17" y1="9" x2="23" y2="15"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
            </svg>
          )}
        </button>
      )}

      {/* Scroll cue */}
      <div className="video-hero-scroll-cue">
        <div className="scroll-line" />
        <span>Scroll</span>
      </div>
    </div>
  );
}
