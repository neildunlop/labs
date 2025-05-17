import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container container">
        <Link to="/" className="logo">
          <img 
            src="/burendo_logo.png" 
            alt="Burendo Labs" 
            className="logo-image"
          />
          <span className="logo-text">Burendo Labs</span>
        </Link>
        
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/projects" className="nav-link">Projects</Link>
          <Link to="/suggest" className="nav-link">Suggest Project</Link>
        </div>

        <div className="nav-actions">
          <Link to="/signup" className="btn btn-primary">Sign Up</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 