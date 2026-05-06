import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return setError("Please provide a valid email address format.");
  }

    setError('');

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setIsLoading(true);

    try {
      await register(name, email, password);
      navigate('/profile');
    } catch (err) {
      setError(err.message || 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-container">
        <div className="auth-brand">
          <Link to="/">
            <span className="logo-icon">🛒</span>
            <span className="logo-text">Shop<span className="logo-accent">Vibe</span></span>
          </Link>
        </div>

        <div className="auth-card">
          <div className="auth-card-header">
            <h1>Create Account</h1>
            <p>Join us to start shopping</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error && (
              <div className="auth-error">
                <span className="auth-error-icon">⚠️</span>
                {error}
              </div>
            )}

            <div className="auth-form-group">
              <label className="auth-form-label">Full Name</label>
              <div className="auth-input-wrapper">
                <input
                  type="text"
                  className="auth-form-input"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <span className="auth-input-icon">👤</span>
              </div>
            </div>

            <div className="auth-form-group">
              <label className="auth-form-label">Email Address</label>
              <div className="auth-input-wrapper">
                <input
                  type="email"
                  className="auth-form-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <span className="auth-input-icon">✉️</span>
              </div>
            </div>

            <div className="auth-form-group">
              <label className="auth-form-label">Password</label>
              <div className="auth-input-wrapper">
                <input
                  type="password"
                  className="auth-form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span className="auth-input-icon">🔒</span>
              </div>
            </div>

            <div className="auth-form-group">
              <label className="auth-form-label">Confirm Password</label>
              <div className="auth-input-wrapper">
                <input
                  type="password"
                  className="auth-form-input"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <span className="auth-input-icon">🛡️</span>
              </div>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={isLoading}>
              {isLoading ? (
                <><span className="auth-spinner"></span> Creating...</>
              ) : (
                'Sign Up'
              )}
            </button>

            <div className="auth-divider">
              <span>or</span>
            </div>

            <div className="auth-footer">
              <p>Already have an account? <Link to="/login">Log in</Link></p>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
