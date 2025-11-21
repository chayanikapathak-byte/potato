import { defineStore } from "pinia";
import { ref } from "vue";
import { useAuthStore } from "./auth";

export const useProfileStore = defineStore("profile", () => {
  const profile = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const fetchProfile = async () => {
    const authStore = useAuthStore();
    if (!authStore.isAuthenticated) return;

    try {
      loading.value = true;
      error.value = null;

      const api = authStore.getApiInstance();
      const response = await api.get("/profile");
      profile.value = response.data;
    } catch (err) {
      error.value = err.response?.data?.error || "Failed to fetch profile";
      console.error("Fetch profile error:", err);
    } finally {
      loading.value = false;
    }
  };

  const updateProfile = async (updates) => {
    const authStore = useAuthStore();
    if (!authStore.isAuthenticated) return;

    try {
      loading.value = true;
      error.value = null;

      const api = authStore.getApiInstance();
      const response = await api.put("/profile", updates);
      profile.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.error || "Failed to update profile";
      console.error("Update profile error:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
  };
});
