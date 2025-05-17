import React, { useState } from 'react';
import { signUp, confirmSignUp, signIn, resendConfirmationCode } from '../services/auth';
import { AuthUser } from '../services/types';

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
  const [isResending, setIsResending] = useState(false);

  const handleResendCode = async () => {
    try {
      setIsResending(true);
      setError('');
      await resendConfirmationCode(username);
      setError('A new confirmation code has been sent to your email');
    } catch (err) {
      console.error('Error resending code:', err);
      setError(err instanceof Error ? err.message : 'Failed to resend confirmation code');
    } finally {
      setIsResending(false);
    }
  };

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
      console.error('Sign in error:', err);
      if (err instanceof Error) {
        if (err.message.includes('Incorrect username or password')) {
          setError('Invalid username or password');
        } else if (err.message.includes('User is not confirmed')) {
          setError('Please confirm your account first');
        } else if (err.message.includes('Invalid verification code')) {
          setError('Invalid confirmation code. Please check the code and try again.');
        } else {
          setError(err.message);
        }
      } else {
        setError('An error occurred during sign in');
      }
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

            {isSignUp ? (
              // Sign Up fields
              <>
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
              </>
            ) : (
              // Sign In fields
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

            {isSignUp && showConfirmation && (
              <>
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
                <div className="form-actions">
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={isResending}
                    className="btn btn-secondary"
                  >
                    {isResending ? 'Sending...' : 'Resend Code'}
                  </button>
                </div>
              </>
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
                  // Clear fields when switching modes
                  setUsername('');
                  setEmail('');
                  setPassword('');
                  setCode('');
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