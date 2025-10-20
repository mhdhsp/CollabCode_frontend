import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../Services/AuthService';
function Signup() {
  const [form, setForm] = useState({ userName: '', passWord: '', email: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      await AuthService.signup(form);
      setSuccess(true); // show success message
      setTimeout(() => {
        navigate('/login'); // redirect after 2s
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100 bg-dark">
      <div className="card p-4 shadow text-light" style={{ minWidth: '350px', backgroundColor: '#1e1e1e' }}>
        <h3 className="text-center mb-3">Sign Up</h3>

        {error && <div className="alert alert-danger">{error}</div>}

        {success && (
          <div className="alert alert-success animate__animated animate__fadeIn mb-3">
            🎉 User registered successfully! Redirecting to login...
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input 
              type="text" 
              className="form-control bg-secondary text-light border-0" 
              name="userName" 
              value={form.userName} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-control bg-secondary text-light border-0" 
              name="passWord" 
              value={form.passWord} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              className="form-control bg-secondary text-light border-0" 
              name="email" 
              value={form.email} 
              onChange={handleChange} 
              required 
            />
          </div>
          <button type="submit" className="btn btn-success w-100">Sign Up</button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
