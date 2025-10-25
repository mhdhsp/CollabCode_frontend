// src/store/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  token: null,
  user: null, // { displayName, ... }
  loading: false,
  error: null,
  signupStatus: {
    loading: false,
    error: null,
    success: false,
  },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // LOGIN
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action) {
      const { token, user } = action.payload;
      state.loading = false;
      state.isAuthenticated = true;
      state.token = token ?? null;
      state.user = user ?? null;
      state.error = null;
    },
    loginFailure(state, action) {
      state.loading = false;
      state.error = action.payload ?? 'Login failed';
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
    },

    // SIGNUP (kept separate so it doesn't mark user as authenticated)
    signupStart(state) {
      state.signupStatus.loading = true;
      state.signupStatus.error = null;
      state.signupStatus.success = false;
    },
    signupSuccess(state, action) {
      // Do NOT set isAuthenticated or token here.
      state.signupStatus.loading = false;
      state.signupStatus.success = true;
      state.signupStatus.error = null;

      // Optionally store non-sensitive user info from signup response
      const { user } = action.payload ?? {};
      if (user) {
        state.user = user;
      }
    },
    signupFailure(state, action) {
      state.signupStatus.loading = false;
      state.signupStatus.error = action.payload ?? 'Signup failed';
      state.signupStatus.success = false;
    },

    // LOGOUT
    logout(state) {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.loading = false;
      state.error = null;
      state.signupStatus = { loading: false, error: null, success: false };
    },

    // Optional: clear errors
    clearAuthError(state) {
      state.error = null;
      state.signupStatus.error = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  signupStart,
  signupSuccess,
  signupFailure,
  logout,
  clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;