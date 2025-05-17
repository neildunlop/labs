import React, { useState } from 'react';
import { signUp, confirmSignUp, signIn, AuthUser } from '../services/auth';

interface AuthProps {
  onAuth: (user: AuthUser) => void;
}

export const Auth: React.FC<AuthProps> = ({ onAuth }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isSignUp) {
        if (showConfirmation) {
          await confirmSignUp(username, code);
          const user = await signIn(username, password);
          onAuth(user);
        } else {
          await signUp(username, email, password);
          setShowConfirmation(true);
        }
      } else {
        const user = await signIn(username, password);
        onAuth(user);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className="form-section">
      <div className="container">
        <div className="form-container">
          <form onSubmit={handleSubmit} className="signup-form">
            <h2 className="form-title">
              {isSignUp ? (showConfirmation ? 'Confirm Sign Up' : 'Sign Up') : 'Sign In'}
            </h2>
            
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-input"
                required
              />
            </div>

            {isSignUp && !showConfirmation && (
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                required
              />
            </div>

            {showConfirmation && (
              <div className="form-group">
                <label htmlFor="code">Confirmation Code</label>
                <input
                  type="text"
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
            )}

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {isSignUp ? (showConfirmation ? 'Confirm' : 'Sign Up') : 'Sign In'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setShowConfirmation(false);
                  setError('');
                }}
                className="btn btn-secondary"
              >
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}; 