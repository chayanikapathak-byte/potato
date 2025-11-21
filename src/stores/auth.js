import { defineStore } from "pinia";
import { ref, computed } from "vue";
import axios from "axios";

const API_URL = "/api";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(JSON.parse(localStorage.getItem("user") || "null"));
  const loading = ref(false);
  const error = ref(null);

  const isAuthenticated = computed(() => !!user.value);

  const api = axios.create({
    baseURL: API_URL,
  });

  api.interceptors.request.use((config) => {
    if (user.value?.id) {
      config.params = config.params || {};
      config.params.userId = user.value.id;
      if (config.method !== 'get') {
        config.data = config.data || {};
        config.data.userId = user.value.id;
      }
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

      user.value = response.data.user;
      localStorage.setItem("user", JSON.stringify(response.data.user));

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

      user.value = response.data.user;
      localStorage.setItem("user", JSON.stringify(response.data.user));

      return true;
    } catch (err) {
      error.value = err.response?.data?.error || "Login failed";
      return false;
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    user.value = null;
    localStorage.removeItem("user");
  };

  const fetchUser = async () => {
    if (!user.value?.id) return;

    try {
      const response = await axios.get(`${API_URL}/auth/me`, {
        params: { userId: user.value.id }
      });
      user.value = response.data;
      localStorage.setItem("user", JSON.stringify(response.data));
    } catch (err) {
      console.error("Failed to fetch user:", err);
      logout();
    }
  };

  const getApiInstance = () => api;

  return {
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
