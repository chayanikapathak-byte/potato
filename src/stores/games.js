import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useAuthStore } from "./auth";

export const useGameStore = defineStore("games", () => {
  const games = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const filteredGames = computed(() => {
    return (statusFilter = "all", searchQuery = "") => {
      return games.value.filter((game) => {
        const matchesStatus =
          statusFilter === "all" || game.status === statusFilter;
        const matchesSearch =
          game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          game.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (game.genres &&
            game.genres.some((genre) =>
              genre.toLowerCase().includes(searchQuery.toLowerCase()),
            ));
        return matchesStatus && matchesSearch;
      });
    };
  });

  const stats = computed(() => {
    const total = games.value.length;
    const completed = games.value.filter(
      (g) => g.status === "completed",
    ).length;
    const playing = games.value.filter((g) => g.status === "playing").length;
    const backlog = games.value.filter((g) => g.status === "backlog").length;
    const totalPlaytime = games.value.reduce(
      (sum, game) => sum + (game.playtime || 0),
      0,
    );
    const avgRating =
      games.value
        .filter((g) => g.rating !== null && g.rating !== undefined)
        .reduce((sum, game) => sum + game.rating, 0) /
        games.value.filter((g) => g.rating !== null && g.rating !== undefined)
          .length || 0;

    return {
      total,
      completed,
      playing,
      backlog,
      totalPlaytime,
      avgRating: avgRating.toFixed(1),
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  });

  const fetchGames = async () => {
    const authStore = useAuthStore();
    if (!authStore.isAuthenticated) return;

    try {
      loading.value = true;
      error.value = null;

      const api = authStore.getApiInstance();
      const response = await api.get("/games");
      games.value = response.data;
    } catch (err) {
      error.value = err.response?.data?.error || "Failed to fetch games";
      console.error("Fetch games error:", err);
    } finally {
      loading.value = false;
    }
  };

  const addGame = async (game) => {
    const authStore = useAuthStore();
    if (!authStore.isAuthenticated) return;

    try {
      loading.value = true;
      error.value = null;

      const gameData = {
        ...game,
        progress: game.progress || 0,
        playtime: game.playtime || 0,
        rating: game.rating || null,
        started_date:
          game.status === "playing" && !game.started_date
            ? new Date().toISOString().split("T")[0]
            : game.started_date || null,
        completed_date: game.completed_date || null,
      };

      const api = authStore.getApiInstance();
      const response = await api.post("/games", gameData);
      games.value.push(response.data);
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.error || "Failed to add game";
      console.error("Add game error:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateGame = async (id, updates) => {
    const authStore = useAuthStore();
    if (!authStore.isAuthenticated) return;

    try {
      loading.value = true;
      error.value = null;

      const index = games.value.findIndex((g) => g.id === id);
      if (index === -1) return;

      const currentGame = games.value[index];
      const updatedData = { ...currentGame, ...updates };

      if (
        updates.progress === 100 &&
        updatedData.status !== "completed"
      ) {
        updatedData.status = "completed";
        updatedData.completed_date = new Date().toISOString().split("T")[0];
      }

      const api = authStore.getApiInstance();
      const response = await api.put(`/games/${id}`, updatedData);
      games.value[index] = response.data;
    } catch (err) {
      error.value = err.response?.data?.error || "Failed to update game";
      console.error("Update game error:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteGame = async (id) => {
    const authStore = useAuthStore();
    if (!authStore.isAuthenticated) return;

    try {
      loading.value = true;
      error.value = null;

      const api = authStore.getApiInstance();
      await api.delete(`/games/${id}`);

      const index = games.value.findIndex((g) => g.id === id);
      if (index !== -1) {
        games.value.splice(index, 1);
      }
    } catch (err) {
      error.value = err.response?.data?.error || "Failed to delete game";
      console.error("Delete game error:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    games,
    loading,
    error,
    filteredGames,
    stats,
    fetchGames,
    addGame,
    updateGame,
    deleteGame,
  };
});
