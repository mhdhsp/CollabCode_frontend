// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { LOCALSTORAGE_TOKEN_KEY } from '../config/constants';
import authService from '../services/api/authService';

// Initial state
const initialState = {
  isAuthenticated: false,
  token: null,
  user: null,
  loading: false,
  error: null,
  signupStatus: {
    loading: false,
    error: null,
    success: false,
  },
};

// Action types
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  SIGNUP_START: 'SIGNUP_START',
  SIGNUP_SUCCESS: 'SIGNUP_SUCCESS',
  SIGNUP_FAILURE: 'SIGNUP_FAILURE',
  LOGOUT: 'LOGOUT',
  CLEAR_ERROR: 'CLEAR_ERROR',
  INITIALIZE_AUTH: 'INITIALIZE_AUTH',
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        token: action.payload.token,
        user: action.payload.user,
        error: null,
      };
    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        isAuthenticated: false,
        token: null,
        user: null,
      };
    case AUTH_ACTIONS.SIGNUP_START:
      return {
        ...state,
        signupStatus: {
          loading: true,
          error: null,
          success: false,
        },
      };
    case AUTH_ACTIONS.SIGNUP_SUCCESS:
      return {
        ...state,
        signupStatus: {
          loading: false,
          success: true,
          error: null,
        },
        user: action.payload.user,
      };
    case AUTH_ACTIONS.SIGNUP_FAILURE:
      return {
        ...state,
        signupStatus: {
          loading: false,
          error: action.payload,
          success: false,
        },
      };
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        token: null,
        user: null,
        loading: false,
        error: null,
        signupStatus: {
          loading: false,
          error: null,
          success: false,
        },
      };
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
        signupStatus: {
          ...state.signupStatus,
          error: null,
        },
      };
    case AUTH_ACTIONS.INITIALIZE_AUTH:
      return {
        ...state,
        isAuthenticated: !!action.payload.token,
        token: action.payload.token,
        user: action.payload.user,
      };
    default:
      return state;
  }
};

// Context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem(LOCALSTORAGE_TOKEN_KEY);
    if (token) {
      // You might want to validate the token with the server here
      dispatch({
        type: AUTH_ACTIONS.INITIALIZE_AUTH,
        payload: { token, user: null }, // You could store user info in localStorage too
      });
    }
  }, []);

  // Actions
  const login = async ({ userNameOrEmail, password }) => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOGIN_START });

      const res = await authService.login({ userNameOrEmail, password });
      const token = res?.token ?? res?.Token;
      const userName = res?.userName ?? res?.UserName ?? userNameOrEmail;

      if (!token) {
        throw new Error('No token returned from server');
      }

      localStorage.setItem(LOCALSTORAGE_TOKEN_KEY, token);
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { token, user: { displayName: userName } },
      });
    } catch (err) {
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: err.message || 'Login failed',
      });
      throw err;
    }
  };

  const signup = async ({ userName, email, password }) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SIGNUP_START });

      const registerRes = await authService.register({ userName, email, password });
      const userNameFromRegister = registerRes?.userName ?? registerRes?.UserName ?? userName ?? email;

      dispatch({
        type: AUTH_ACTIONS.SIGNUP_SUCCESS,
        payload: { user: { displayName: userNameFromRegister } },
      });

      return registerRes;
    } catch (err) {
      dispatch({
        type: AUTH_ACTIONS.SIGNUP_FAILURE,
        payload: err.message || 'Signup failed',
      });
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      localStorage.removeItem(LOCALSTORAGE_TOKEN_KEY);
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  const value = {
    ...state,
    login,
    signup,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
