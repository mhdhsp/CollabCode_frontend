// src/pages/SignupPage.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SignupForm from '../components/SignupForm';
import { signup } from '../store/actions/authActions';
import { selectAuthError } from '../store/selectors/authSelectors';
import useAuthRedirect from '../hooks/useAuthRedirect';

const SignupPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const globalError = useSelector(selectAuthError);
  useAuthRedirect(); // redirect if already authenticated

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleSignup = async ({ userName, email, password }) => {
    setSubmitting(true);
    setFormError(null);
    setSuccessMsg(null);

    try {
      const res = await dispatch(signup({ userName, email, password }));
      const serverMessage = res?.Message ?? 'Account created successfully. Please sign in.';
      setSuccessMsg(serverMessage);

      // Immediately redirect to login (no auto-login). Remove timeout to redirect instantly.
      setTimeout(() => navigate('/login', { replace: true }), 700);
    } catch (err) {
      setFormError(err.message || 'Signup failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2>Create an account</h2>
          <p className="text-muted">Join and collaborate in realtime.</p>

          {successMsg && <div className="alert alert-success">{successMsg}</div>}
          <SignupForm onSubmit={handleSignup} submitting={submitting} error={formError || globalError} />
        </div>
      </div>
    </div>
  );
};

export default SignupPage;