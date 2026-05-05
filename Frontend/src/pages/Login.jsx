import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/profile');
    } catch (err) {
      setError(err.message || 'Failed to login');
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
            <h1>Welcome Back</h1>
            <p>Log in to your account to continue</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error && (
              <div className="auth-error">
                <span className="auth-error-icon">⚠️</span>
                {error}
              </div>
            )}

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

            <button type="submit" className="auth-submit-btn" disabled={isLoading}>
              {isLoading ? (
                <><span className="auth-spinner"></span> Logging in...</>
              ) : (
                'Log In'
              )}
            </button>

            <div className="auth-divider">
              <span>or</span>
            </div>

            <div className="auth-footer">
              <p>Don't have an account? <Link to="/register">Sign up</Link></p>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
