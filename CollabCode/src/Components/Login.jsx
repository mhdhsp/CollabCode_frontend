import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthService } from '../Services/AuthService';
import 'animate.css'; 

function Login() {
  const [form, setForm] = useState({ userName: '', passWord: '' });
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
      const res = await AuthService.login(form);
      console.log(res);
      localStorage.setItem('token', res.data.token);

      // show success message
      setSuccess(true);

      // redirect after 1.5s
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100 bg-dark">
      <div className="card p-4 shadow text-light" style={{ minWidth: '350px', backgroundColor: '#1e1e1e' }}>
        <h3 className="text-center mb-3">Login</h3>

        {/* Error Message */}
        {error && <div className="alert alert-danger animate__animated animate__fadeIn">{error}</div>}

        {/* Success Message */}
        {success && (
          <div className="alert alert-success animate__animated animate__fadeIn mb-3">
            🎉 Logged in successfully! Redirecting...
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
          <button type="submit" className="btn btn-primary w-100 mb-2">
            Login
          </button>
        </form>

        <div className="text-center mt-2">
          <span className="text-light">Don't have an account? </span>
          <Link to="/signup" className="text-info">Sign Up</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
