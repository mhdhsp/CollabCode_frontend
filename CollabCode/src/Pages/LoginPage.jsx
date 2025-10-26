// src/pages/LoginPage.js
import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import { useAuth } from '../contexts/AuthContext';
import useAuthRedirect from '../hooks/useAuthRedirect';

const LoginPage = () => {
  const { login, error } = useAuth();
  useAuthRedirect(); // redirect if already authenticated

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const handleLogin = async ({ userNameOrEmail, password }) => {
    setSubmitting(true);
    setFormError(null);
    try {
      await login({ userNameOrEmail, password });
      // redirect handled by useAuthRedirect or other logic
    } catch (err) {
      setFormError(err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2>Sign in</h2>
          <p className="text-muted">Welcome back — sign in to continue.</p>
          <LoginForm onSubmit={handleLogin} submitting={submitting} error={formError || error} />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;