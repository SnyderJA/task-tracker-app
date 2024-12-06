import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Auth.css';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      await signup(email, password);
      navigate('/');
    } catch (error) {
      if (error.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters');
      } else if (error.code === 'auth/email-already-in-use') {
        setError('Email already in use');
      } else if (error.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else {
        setError('Failed to create an account: ' + error.message);
      }
    }
  }

  return (
    <div className="auth-container">
      <h2 className="auth-header">Create Account</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label>Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input 
            type="password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" className="auth-button">Create Account</button>
      </form>
      <div className="auth-link">
        Already have an account? <Link to="/login">Sign in</Link>
      </div>
    </div>
  );
}

export default Signup; 