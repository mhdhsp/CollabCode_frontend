// src/pages/LoginPage.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LoginForm from '../components/LoginForm';
import { login } from '../store/actions/authActions';
import { selectAuthError } from '../store/selectors/authSelectors';
import useAuthRedirect from '../hooks/useAuthRedirect';

const LoginPage = () => {
  const dispatch = useDispatch();
  const globalError = useSelector(selectAuthError);
  useAuthRedirect(); // redirect if already authenticated

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const handleLogin = async ({ userNameOrEmail, password }) => {
    setSubmitting(true);
    setFormError(null);
    try {
      await dispatch(login({ userNameOrEmail, password }));
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
          <LoginForm onSubmit={handleLogin} submitting={submitting} error={formError || globalError} />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;