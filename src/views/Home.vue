<template>
  <div class="space-y-8 animate-fade-in">
    <!-- Hero Section -->
    <section class="text-center py-12 px-4">
      <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-dark-900 mb-4">
        Track Your <span class="text-primary-600">Gaming</span> Journey
      </h1>
      <p class="text-xl text-gray-600 dark:text-dark-600 max-w-2xl mx-auto mb-8">
        Keep track of the games you're playing, want to play, and have completed with a beautiful, fast interface.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <router-link to="/library" class="btn btn-primary text-lg px-6 py-3">
          View Library
        </router-link>
        <button @click="showAddGameModal = true" class="btn btn-secondary text-lg px-6 py-3">
          Add Game
        </button>
      </div>
    </section>

    <!-- Quick Stats -->
    <section class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="card p-6 text-center">
        <div class="text-3xl font-bold text-primary-600 mb-2">{{ stats.total }}</div>
        <div class="text-sm text-gray-600 dark:text-dark-600">Total Games</div>
      </div>
      <div class="card p-6 text-center">
        <div class="text-3xl font-bold text-green-600 mb-2">{{ stats.playing }}</div>
        <div class="text-sm text-gray-600 dark:text-dark-600">Now Playing</div>
      </div>
      <div class="card p-6 text-center">
        <div class="text-3xl font-bold text-blue-600 mb-2">{{ stats.completed }}</div>
        <div class="text-sm text-gray-600 dark:text-dark-600">Completed</div>
      </div>
      <div class="card p-6 text-center">
        <div class="text-3xl font-bold text-purple-600 mb-2">{{ Math.round(stats.totalPlaytime) }}h</div>
        <div class="text-sm text-gray-600 dark:text-dark-600">Total Playtime</div>
      </div>
    </section>

    <!-- Currently Playing -->
    <section v-if="currentlyPlaying.length > 0">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-dark-900 mb-6">Currently Playing</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <GameCard
          v-for="game in currentlyPlaying"
          :key="game.id"
          :game="game"
          @update="updateGame"
          @delete="deleteGame"
        />
      </div>
    </section>

    <!-- Recent Activity -->
    <section>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-dark-900 mb-6">Recent Activity</h2>
      <div class="card p-6">
        <div class="space-y-4">
          <div v-for="game in recentGames" :key="game.id" class="flex items-center space-x-4">
            <img 
              :src="game.coverImage" 
              :alt="game.title"
              class="w-12 h-12 rounded-lg object-cover"
            >
            <div class="flex-1">
              <h3 class="font-medium text-gray-900 dark:text-dark-900">{{ game.title }}</h3>
              <p class="text-sm text-gray-600 dark:text-dark-600">
                {{ getStatusText(game.status) }} • {{ game.progress }}% complete
              </p>
            </div>
            <div class="text-sm text-gray-500">
              {{ formatDate(game.startedDate || game.completedDate) }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Add Game Modal -->
    <AddGameModal
      v-if="showAddGameModal"
      @close="showAddGameModal = false"
      @add="handleAddGame"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useGameStore } from '@/stores/games'
import { useAuthStore } from '@/stores/auth'
import GameCard from '@/components/GameCard.vue'
import AddGameModal from '@/components/AddGameModal.vue'

const gameStore = useGameStore()
const authStore = useAuthStore()
const showAddGameModal = ref(false)

const stats = computed(() => gameStore.stats)
const currentlyPlaying = computed(() => 
  gameStore.games.filter(game => game.status === 'playing').slice(0, 6)
)
const recentGames = computed(() => 
  [...gameStore.games]
    .sort((a, b) => {
      const dateA = new Date(a.completedDate || a.startedDate || 0)
      const dateB = new Date(b.completedDate || b.startedDate || 0)
      return dateB - dateA
    })
    .slice(0, 5)
)

const updateGame = (id, updates) => {
  gameStore.updateGame(id, updates)
}

const deleteGame = (id) => {
  gameStore.deleteGame(id)
}

const handleAddGame = async (gameData) => {
  try {
    await gameStore.addGame(gameData)
    showAddGameModal.value = false
  } catch (error) {
    console.error('Failed to add game:', error)
  }
}

const getStatusText = (status) => {
  const statusMap = {
    playing: 'Playing',
    completed: 'Completed',
    backlog: 'Backlog'
  }
  return statusMap[status] || status
}

const formatDate = (dateString) => {
  if (!dateString) return 'No date'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  })
}

onMounted(async () => {
  await authStore.fetchUser()
  await gameStore.fetchGames()
})
</script>