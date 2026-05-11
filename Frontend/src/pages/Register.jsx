import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleStepOne = async (e) => {
    e.preventDefault();
    setError('');

    // 1. Validation Logic
    if (password !== confirmPassword) return setError('Passwords do not match');
    if (password.length < 6) return setError('Password must be 6+ chars');

    setIsLoading(true);
    try {
      // 2. Call backend to check user & send OTP
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        // 3. SUCCESS: Pass data to the Verify page via state
        navigate('/verify-otp', { 
          state: { name, email, password } 
        });
      } else {
        setError(data.message || "Failed to proceed.");
      }
    } catch (err) {
      setError("Server connection failed.");
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
          </div>

          <form className="auth-form" onSubmit={handleStepOne}>
            {error && <div className="auth-error">⚠️ {error}</div>}

            <div className="auth-form-group">
              <label className="auth-form-label">Full Name</label>
              <input className="auth-form-input" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="auth-form-group">
              <label className="auth-form-label">Email Address</label>
              <input className="auth-form-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="auth-form-group">
              <label className="auth-form-label">Password</label>
              <input className="auth-form-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <div className="auth-form-group">
              <label className="auth-form-label">Confirm Password</label>
              <input className="auth-form-input" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>

            <button type="submit" className="auth-submit-btn" disabled={isLoading}>
              {isLoading ? "Checking..." : "Get Verification Code"}
            </button>

            <div className="auth-footer">
              <p>Already have an account? <Link to="/login">Log in</Link></p>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}