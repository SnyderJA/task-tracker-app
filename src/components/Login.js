import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Auth.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError('');
      await login(email, password);
      navigate('/');
    } catch (error) {
      setError('Failed to login');
    }
  }

  return (
    <div className="auth-container">
      <h2 className="auth-header">Sign in to your account</h2>
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
        <button type="submit" className="auth-button">Continue</button>
      </form>
      <div className="auth-link">
        Don't have an account? <Link to="/signup">Create one now</Link>
      </div>
    </div>
  );
}

export default Login; 