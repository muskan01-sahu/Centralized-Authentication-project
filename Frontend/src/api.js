// const AUTH_URL = "http://localhost:5000";
const AUTH_URL = "https://centralized-authentication-project-3.onrender.com";

// const RES_URL = "http://localhost:5001";
const RES_URL = "https://centralized-authentication-project.onrender.com";

// Get Stored Token
  const getToken = () => localStorage.getItem("accessToken");

// Common Request Helper 
  const request = async (url, options = {}) => {
    try {
      const token = getToken();

      const headers = {
        "Content-Type": "application/json",
        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),
        ...(options.headers || {}),
      };

      const response = await fetch(url, {
        ...options,
        headers,
        credentials: "include",
      });

      // Prevent crash if server returns empty response
      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      // Handle API errors
      if (!response.ok) {
        throw new Error(data.message || "Request failed");
      }

      return data;

    } catch (error) {
      console.log("API ERROR:", error);
      throw error;
    }
  };

  // AUTH API
  export const API = {
    // Login
    login: async (email, password) => {
      const data = await request(`${AUTH_URL}/auth/login`, {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      return data.data;
    },

    // Register
    register: async (email, password, role) => {
      const data = await request(`${AUTH_URL}/auth/register`, {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
          role,
        }),
      });

      return data.data;
    },

    // Refresh token
    refresh: async (refreshToken) => {
      const data = await request(`${AUTH_URL}/auth/refresh`, {
        method: "POST",
        body: JSON.stringify({
          refreshToken,
        }),
      });

      return data.data;
    },

    // Logout
    logout: async () => {
      const data = await request(`${AUTH_URL}/auth/logout`, {
        method: "POST",
      });

      return data.data;
    },

    // Orders API

    // Get all orders
    getOrders: async () => {
      const data = await request(`${RES_URL}/orders`);

      return data.data;
    },

    // Create order
    createOrder: async (order) => {
      const data = await request(`${RES_URL}/orders`, {
        method: "POST",
        body: JSON.stringify(order),
      });

      return data.data;
    },

    // Delete order
    deleteOrder: async (id) => {
      const data = await request(`${RES_URL}/orders/${id}`, {
        method: "DELETE",
      });

      return data.data;
    },
  };

  // JWT Decode Helper
  export const decodeToken = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return null;
    }
  };

  // Permission Helper
  export const hasPermission = (permissions, required) => {
    return permissions?.includes(required) ?? false;
  };