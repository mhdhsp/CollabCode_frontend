// src/store/actions/authActions.js
import authService from '../../services/api/authService';
import { LOCALSTORAGE_TOKEN_KEY } from '../../config/constants';
import {
  loginStart,
  loginSuccess,
  loginFailure,
  signupStart,
  signupSuccess,
  signupFailure,
  logout as logoutAction,
} from '../slices/authSlice';

/**
 * signup thunk:
 *  - Calls register endpoint with { userName, email, password } mapping.
 *  - DOES NOT auto-login. Returns register response.
 */
export const signup = ({ userName, email, password }) => async (dispatch) => {
  try {
    dispatch(signupStart());

    const registerRes = await authService.register({ userName, email, password });

    const userNameFromRegister = registerRes?.userName ?? registerRes?.UserName ?? userName ?? email;

    // Store a lightweight signup success state (no token)
    dispatch(
      signupSuccess({
        token: null,
        user: { displayName: userNameFromRegister },
      })
    );

    return registerRes;
  } catch (err) {
    dispatch(signupFailure(err.message || 'Signup failed'));
    throw err;
  }
};

/**
 * login thunk:
 *  - Calls login endpoint and stores token on success.
 */
export const login = ({ userNameOrEmail, password }) => async (dispatch) => {
  try {
    dispatch(loginStart());

    const res = await authService.login({ userNameOrEmail, password });
    console.log("from action");
    console.log(res);
    
    
    const token = res?.token ?? res?.Token;
    const userName = res?.userName ?? res?.UserName ?? userNameOrEmail;

    if (!token) {
      dispatch(loginFailure('No token returned from server'));
      throw new Error('No token returned from server');
    }

    localStorage.setItem(LOCALSTORAGE_TOKEN_KEY, token);
    dispatch(loginSuccess({ token, user: { displayName: userName } }));
  } catch (err) {
    dispatch(loginFailure(err.message || 'Login failed'));
    throw err;
  }
};

export const performLogout = () => async (dispatch) => {
  try {
    await authService.logout();
  } finally {
    localStorage.removeItem(LOCALSTORAGE_TOKEN_KEY);
    dispatch(logoutAction());
  }
};