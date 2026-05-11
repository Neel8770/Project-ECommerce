import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function VerifyOTP() {
  const location = useLocation();
  const navigate = useNavigate();
  const { register } = useAuth();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Retrieve user data passed from Register.jsx
  const { name, email, password } = location.state || {};

  // If someone tries to access this page directly without data, kick them back
  if (!email) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <p>No registration data found.</p>
          <Link to="/register">Go back to Register</Link>
        </div>
      </div>
    );
  }

 const handleFinalRegister = async (e) => {
  e.preventDefault();
  setError("");
  
  // LOG A: Check if we even have the data to send
  console.log("CRITICAL: Starting handleFinalRegister");
  console.log("CRITICAL: Data check ->", { name, email, password, otp });

  if (!name || !email || !password || !otp) {
    const missing = !name ? "name" : !email ? "email" : !password ? "password" : "otp";
    console.error("CRITICAL ERROR: Missing field ->", missing);
    return setError(`Frontend Error: Missing ${missing} data.`);
  }

  setIsLoading(true);
  try {
    console.log("CRITICAL: Calling register function now...");
    await register(name, email, password, otp);
    console.log("CRITICAL: Register success!");
    navigate('/profile');
  } catch (err) {
    console.error("CRITICAL CATCH:", err);
    // This is likely where your "Server connection error" text is coming from
    setError(err.message || "Server connection error"); 
  } finally {
    setIsLoading(false);
  }
};

  return (
    <main className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-card-header">
            <h1>Verify Email</h1>
            <p>Enter the code sent to <b>{email}</b></p>
          </div>

          <form className="auth-form" onSubmit={handleFinalRegister}>
  {error && <div className="auth-error">⚠️ {error}</div>}
  
  <div className="auth-form-group">
    <label className="auth-form-label">OTP Code</label>
    <input 
      type="text" 
      className="auth-form-input"
      placeholder="000000"
      value={otp}
      maxLength="6"
      onChange={(e) => {
        setOtp(e.target.value.replace(/\D/g, ""));
        if (error) setError(''); // CLEAR ERROR instantly when user types
      }}
      required 
    />
  </div>

  {/* Added class for styling + stricter disabled logic */}
  <button 
    type="submit" 
    className="auth-submit-btn" 
    disabled={isLoading || otp.length < 6}
  >
    {isLoading ? "Verifying..." : "Complete Registration"}
  </button>

  {/* Moved outside or kept as button type to ensure no form trigger */}
  <button 
    type="button" 
    className="auth-submit-btn" 
    style={{ backgroundColor: '#6c757d', marginTop: '10px' }}
    onClick={(e) => {
      e.preventDefault(); // Extra safety
      navigate(-1);
    }}
  >
    ← Go Back 
  </button>
</form>
        </div>
      </div>
    </main>
  );
}