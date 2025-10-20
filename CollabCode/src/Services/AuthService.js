import api from "./api";

export const AuthService = {
  // 🟢 Login user
  login: async (user) => {
    const response = await api.post("/api/Auth/Login", user);

    // Store token if it exists
    if (response.data?.token) {
      localStorage.setItem("token", response.data.token);
    }

    return response.data;
  },

  // 🟢 Register user
  signup: async (user) => {
    const response = await api.post("/api/Auth/Register", user);
    return response.data;
  },

  // 🔴 Logout
  logout: () => {
    localStorage.removeItem("token");
  },

  
};
