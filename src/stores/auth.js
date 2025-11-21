import { defineStore } from "pinia";
import { ref, computed } from "vue";
import axios from "axios";

const API_URL = "http://localhost:3001/api";

export const useAuthStore = defineStore("auth", () => {
  const token = ref(localStorage.getItem("token") || null);
  const user = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const isAuthenticated = computed(() => !!token.value);

  const api = axios.create({
    baseURL: API_URL,
  });

  api.interceptors.request.use((config) => {
    if (token.value) {
      config.headers.Authorization = `Bearer ${token.value}`;
    }
    return config;
  });

  const signup = async (username, password) => {
    try {
      loading.value = true;
      error.value = null;

      const response = await axios.post(`${API_URL}/auth/signup`, {
        username,
        password,
      });

      token.value = response.data.token;
      user.value = response.data.user;
      localStorage.setItem("token", response.data.token);

      return true;
    } catch (err) {
      error.value = err.response?.data?.error || "Signup failed";
      return false;
    } finally {
      loading.value = false;
    }
  };

  const login = async (username, password) => {
    try {
      loading.value = true;
      error.value = null;

      const response = await axios.post(`${API_URL}/auth/login`, {
        username,
        password,
      });

      token.value = response.data.token;
      user.value = response.data.user;
      localStorage.setItem("token", response.data.token);

      return true;
    } catch (err) {
      error.value = err.response?.data?.error || "Login failed";
      return false;
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    token.value = null;
    user.value = null;
    localStorage.removeItem("token");
  };

  const fetchUser = async () => {
    if (!token.value) return;

    try {
      const response = await api.get("/auth/me");
      user.value = response.data;
    } catch (err) {
      console.error("Failed to fetch user:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        logout();
      }
    }
  };

  const getApiInstance = () => api;

  return {
    token,
    user,
    loading,
    error,
    isAuthenticated,
    signup,
    login,
    logout,
    fetchUser,
    getApiInstance,
  };
});
