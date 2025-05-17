import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const phrases = [
  { main: 'Imagine', sub: 'possibilities' },
  { main: 'Explore', sub: 'technology' },
  { main: 'Experiment', sub: 'boldly' },
  { main: 'Share', sub: 'what matters' }
];

const Landing: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % phrases.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="hero-logo">
          <img
            src="/burendo_logo.png"
            alt="Burendo"
            className="logo-image-large"
          />
        </div>
        <div className="hero-title-container">
          {phrases.map((phrase, index) => (
            <div
              key={phrase.main}
              className={`hero-title-wrapper ${index === currentIndex ? 'active' : ''}`}
            >
              <h1 className="hero-title">
                <span className="hero-title-main">{phrase.main}</span>
                <span className="hero-title-sub">{phrase.sub}</span>
              </h1>
            </div>
          ))}
        </div>
        <div className="hero-subtitle">
          Burendo Labs is our space for innovation and experimentation. It's where we test out ideas, play with new tech, build useful tools, and share what we learn with each other and the wider world.
<br/><br/>
          Whether you're solving a real problem, exploring something emerging, or just following your curiosity, Labs is open to everyone.
        </div>
        <div className="hero-actions">
          <Link to="/projects" className="btn btn-primary btn-large">
            Explore Current Projects
          </Link>
          <Link to="/suggest-project" className="btn btn-white btn-large">
            Submit an Idea
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Landing; 