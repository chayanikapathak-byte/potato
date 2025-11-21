<template>
  <div class="space-y-8 animate-fade-in">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-dark-900 mb-2">Gaming Statistics</h1>
      <p class="text-gray-600 dark:text-dark-600">Track your gaming habits and achievements</p>
    </div>

    <!-- Overview Stats -->
    <section class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="card p-6 text-center">
        <div class="text-4xl font-bold text-primary-600 mb-2">{{ stats.total }}</div>
        <div class="text-sm text-gray-600 dark:text-dark-600">Total Games</div>
      </div>
      <div class="card p-6 text-center">
        <div class="text-4xl font-bold text-green-600 mb-2">{{ stats.completed }}</div>
        <div class="text-sm text-gray-600 dark:text-dark-600">Completed</div>
      </div>
      <div class="card p-6 text-center">
        <div class="text-4xl font-bold text-blue-600 mb-2">{{ stats.completionRate }}%</div>
        <div class="text-sm text-gray-600 dark:text-dark-600">Completion Rate</div>
      </div>
      <div class="card p-6 text-center">
        <div class="text-4xl font-bold text-purple-600 mb-2">{{ Math.round(stats.totalPlaytime) }}h</div>
        <div class="text-sm text-gray-600 dark:text-dark-600">Total Hours</div>
      </div>
    </section>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Status Breakdown -->
      <section class="card p-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-dark-900 mb-6">Status Breakdown</h2>
        <div class="space-y-4">
          <div v-for="(count, status) in statusBreakdown" :key="status" class="flex items-center">
            <div class="flex-1">
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm font-medium text-gray-700 dark:text-dark-700 capitalize">
                  {{ status }}
                </span>
                <span class="text-sm text-gray-500">{{ count }} games</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-dark-300 rounded-full h-2">
                <div
                  class="h-2 rounded-full transition-all duration-500"
                  :class="getStatusColor(status)"
                  :style="{ width: `${(count / stats.total) * 100}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Platform Distribution -->
      <section class="card p-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-dark-900 mb-6">Platform Distribution</h2>
        <div class="space-y-3">
          <div v-for="(count, platform) in platformStats" :key="platform" class="flex items-center justify-between">
            <span class="text-sm font-medium text-gray-700 dark:text-dark-700">{{ platform }}</span>
            <div class="flex items-center space-x-2">
              <div class="w-24 bg-gray-200 dark:bg-dark-300 rounded-full h-2">
                <div
                  class="h-2 bg-primary-600 rounded-full transition-all duration-500"
                  :style="{ width: `${(count / stats.total) * 100}%` }"
                ></div>
              </div>
              <span class="text-sm text-gray-500 w-8 text-right">{{ count }}</span>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Top Rated Games -->
    <section v-if="ratedGames.length > 0" class="card p-6">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-dark-900 mb-6">Top Rated Games</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="game in ratedGames" :key="game.id" class="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-dark-200 rounded-lg">
          <img :src="game.coverImage" :alt="game.title" class="w-16 h-16 rounded-lg object-cover">
          <div class="flex-1">
            <h3 class="font-medium text-gray-900 dark:text-dark-900">{{ game.title }}</h3>
            <p class="text-sm text-gray-600 dark:text-dark-600">{{ game.platform }}</p>
            <div class="flex items-center mt-1">
              <StarIcon v-for="i in 5" :key="i" class="w-4 h-4" :class="i <= game.rating ? 'text-yellow-400' : 'text-gray-300'" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Genre Analysis -->
    <section class="card p-6">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-dark-900 mb-6">Genre Analysis</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div v-for="(count, genre) in genreStats" :key="genre" class="text-center p-4 bg-gray-50 dark:bg-dark-200 rounded-lg">
          <div class="text-2xl font-bold text-primary-600">{{ count }}</div>
          <div class="text-sm text-gray-600 dark:text-dark-600 mt-1">{{ genre }}</div>
        </div>
      </div>
    </section>

    <!-- Recent Completions -->
    <section v-if="recentCompletions.length > 0" class="card p-6">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-dark-900 mb-6">Recent Completions</h2>
      <div class="space-y-4">
        <div v-for="game in recentCompletions" :key="game.id" class="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div class="flex items-center space-x-4">
            <img :src="game.coverImage" :alt="game.title" class="w-12 h-12 rounded-lg object-cover">
            <div>
              <h3 class="font-medium text-gray-900 dark:text-dark-900">{{ game.title }}</h3>
              <p class="text-sm text-gray-600 dark:text-dark-600">{{ game.playtime }} hours • Completed {{ formatDate(game.completedDate) }}</p>
            </div>
          </div>
          <div v-if="game.rating" class="flex items-center">
            <StarIcon v-for="i in 5" :key="i" class="w-4 h-4" :class="i <= game.rating ? 'text-yellow-400' : 'text-gray-300'" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useGameStore } from '@/stores/games'
import { useAuthStore } from '@/stores/auth'
import { StarIcon } from '@heroicons/vue/24/outline'

const gameStore = useGameStore()
const authStore = useAuthStore()
const stats = computed(() => gameStore.stats)

const statusBreakdown = computed(() => {
  const breakdown = {}
  gameStore.games.forEach(game => {
    breakdown[game.status] = (breakdown[game.status] || 0) + 1
  })
  return breakdown
})

const platformStats = computed(() => {
  const platforms = {}
  gameStore.games.forEach(game => {
    platforms[game.platform] = (platforms[game.platform] || 0) + 1
  })
  return platforms
})

const genreStats = computed(() => {
  const genres = {}
  gameStore.games.forEach(game => {
    game.genres.forEach(genre => {
      genres[genre] = (genres[genre] || 0) + 1
    })
  })
  return genres
})

const ratedGames = computed(() => {
  return gameStore.games
    .filter(game => game.rating !== null)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6)
})

const recentCompletions = computed(() => {
  return gameStore.games
    .filter(game => game.status === 'completed' && game.completedDate)
    .sort((a, b) => new Date(b.completedDate) - new Date(a.completedDate))
    .slice(0, 5)
})

const getStatusColor = (status) => {
  const colors = {
    playing: 'bg-blue-500',
    completed: 'bg-green-500',
    backlog: 'bg-yellow-500'
  }
  return colors[status] || 'bg-gray-500'
}

const formatDate = (dateString) => {
  if (!dateString) return ''
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