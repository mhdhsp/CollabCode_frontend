// src/services/api/authService.js
import axiosInstance from './axiosInstance';

// Helper to unwrap ApiResponse<T> returned by your ASP.NET backend
function unwrapApiResponse(res) {
  if (!res || !res.data) throw new Error('Invalid API response');
  return res.data.data ?? res.dat ?? null;
}

const authService = {
  /**
   * Register a new user.
   * Accepts { userName, email, password } and posts userName, email, passWord.
   */
  register: async ({ userName, email, password }) => {
    try {
      const payload = {
        userName,
        email,
        passWord: password,
      };

      const res = await axiosInstance.post('/api/Auth/Register', payload);
      return unwrapApiResponse(res);
    } catch (err) {
      const msg =
        err.response?.data?.Message ||
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Register error';
      throw new Error(msg);
    }
  },

  /**
   * Login a user.
   * Accepts { userNameOrEmail, password } and posts userName, passWord.
   */
  login: async ({ userNameOrEmail, password }) => {
    try {
      const payload = {
        userName: userNameOrEmail,
        passWord: password,
      };

      const res = await axiosInstance.post('/api/Auth/Login', payload);
      return unwrapApiResponse(res);
    } catch (err) {
      const msg =
        err.response?.data?.Message ||
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Login error';
      throw new Error(msg);
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post('/api/Auth/Logout');
      return true;
    } catch {
      return true;
    }
  },
};

export default authService;