import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useGameStore = defineStore("games", () => {
  const games = ref([
    {
      id: 1,
      title: "The Legend of Zelda: Tears of the Kingdom",
      platform: "Nintendo Switch",
      status: "playing",
      progress: 65,
      rating: null,
      coverImage:
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop",
      genres: ["Adventure", "Open World"],
      playtime: 45,
      startedDate: "2023-05-12",
      completedDate: null,
      notes: "Amazing exploration and puzzles!",
    },
    {
      id: 2,
      title: "Elden Ring",
      platform: "PlayStation 5",
      status: "completed",
      progress: 100,
      rating: 5,
      coverImage:
        "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&h=400&fit=crop",
      genres: ["RPG", "Action"],
      playtime: 120,
      startedDate: "2023-02-25",
      completedDate: "2023-04-10",
      notes: "Challenging but rewarding experience.",
    },
    {
      id: 3,
      title: "Baldur's Gate 3",
      platform: "PC",
      status: "backlog",
      progress: 0,
      rating: null,
      coverImage:
        "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&h=400&fit=crop",
      genres: ["RPG", "Strategy"],
      playtime: 0,
      startedDate: null,
      completedDate: null,
      notes: "Waiting for the right time to dive in.",
    },
  ]);

  const filteredGames = computed(() => {
    return (statusFilter = "all", searchQuery = "") => {
      return games.value.filter((game) => {
        const matchesStatus =
          statusFilter === "all" || game.status === statusFilter;
        const matchesSearch =
          game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          game.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
          game.genres.some((genre) =>
            genre.toLowerCase().includes(searchQuery.toLowerCase()),
          );
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
      (sum, game) => sum + game.playtime,
      0,
    );
    const avgRating =
      games.value
        .filter((g) => g.rating !== null)
        .reduce((sum, game) => sum + game.rating, 0) /
        games.value.filter((g) => g.rating !== null).length || 0;

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

  const addGame = (game) => {
    const newGame = {
      ...game,
      id: Date.now(),
      progress: 0,
      playtime: 0,
      rating: null,
      startedDate:
        game.status === "playing"
          ? new Date().toISOString().split("T")[0]
          : null,
      completedDate: null,
    };
    games.value.push(newGame);
  };

  const updateGame = (id, updates) => {
    const index = games.value.findIndex((g) => g.id === id);
    if (index !== -1) {
      games.value[index] = { ...games.value[index], ...updates };

      if (
        updates.progress === 100 &&
        games.value[index].status !== "completed"
      ) {
        games.value[index].status = "completed";
        games.value[index].completedDate = new Date()
          .toISOString()
          .split("T")[0];
      }
    }
  };

  const deleteGame = (id) => {
    const index = games.value.findIndex((g) => g.id === id);
    if (index !== -1) {
      games.value.splice(index, 1);
    }
  };

  return {
    games,
    filteredGames,
    stats,
    addGame,
    updateGame,
    deleteGame,
  };
});
