import React from 'react';
import { Link } from 'react-router-dom';
import { AuthUser } from '../services/auth';

interface NavbarProps {
  user: AuthUser | null;
  onSignOut: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onSignOut }) => {
  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <div className="navbar-brand">
            <Link to="/" className="navbar-logo">
              <img
                src="/burendo_logo.png"
                alt="Burendo Labs"
                className="logo-image"
              />
              <span className="logo-text">
                Burendo Labs
              </span>
            </Link>
          </div>

          <div className="navbar-menu">
            {user ? (
              <>
                <Link
                  to="/projects"
                  className="navbar-link"
                >
                  Projects
                </Link>
                <Link
                  to="/suggest-project"
                  className="navbar-link"
                >
                  Suggest Project
                </Link>
                <div className="navbar-user">
                  <span className="user-email">{user.email}</span>
                  <button
                    onClick={onSignOut}
                    className="btn btn-link"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/"
                className="navbar-link"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}; 