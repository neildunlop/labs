import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1 className="hero-title">Welcome to Burendo Labs</h1>
          <p className="hero-subtitle">
            Where innovation meets collaboration. Join our community of developers
            and contribute to cutting-edge projects.
          </p>
          <div className="hero-actions">
            <Link to="/projects" className="btn btn-primary">Explore Projects</Link>
            <Link to="/signup" className="btn btn-secondary">Join the Community</Link>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="featured-projects">
        <div className="container">
          <h2 className="section-title">Featured Projects</h2>
          <div className="project-grid">
            <div className="card project-card">
              <h3 className="project-title">AI-Powered Code Review</h3>
              <p className="project-description">
                An intelligent system that helps developers review code more efficiently
                using machine learning.
              </p>
              <div className="project-meta">
                <span className="project-status">In Progress</span>
                <span className="project-members">5 Members</span>
              </div>
              <Link to="/projects/1" className="btn btn-secondary">Learn More</Link>
            </div>

            <div className="card project-card">
              <h3 className="project-title">Cloud Migration Tool</h3>
              <p className="project-description">
                A comprehensive tool to help organizations migrate their infrastructure
                to the cloud seamlessly.
              </p>
              <div className="project-meta">
                <span className="project-status">Planning</span>
                <span className="project-members">3 Members</span>
              </div>
              <Link to="/projects/2" className="btn btn-secondary">Learn More</Link>
            </div>

            <div className="card project-card">
              <h3 className="project-title">DevOps Dashboard</h3>
              <p className="project-description">
                A unified dashboard for monitoring and managing DevOps pipelines
                and infrastructure.
              </p>
              <div className="project-meta">
                <span className="project-status">Active</span>
                <span className="project-members">8 Members</span>
              </div>
              <Link to="/projects/3" className="btn btn-secondary">Learn More</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 