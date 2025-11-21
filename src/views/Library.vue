<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Header with Search and Filters -->
    <div class="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-dark-900">Game Library</h1>
      <div class="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
        <div class="relative">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search games..."
            class="input pl-10 w-full sm:w-64"
          />
        </div>
        <select v-model="statusFilter" class="input w-full sm:w-40">
          <option value="all">All Games</option>
          <option value="playing">Playing</option>
          <option value="completed">Completed</option>
          <option value="backlog">Backlog</option>
        </select>
        <button
          @click="showAddGameModal = true"
          class="btn btn-primary whitespace-nowrap"
        >
          Add Game
        </button>
      </div>
    </div>

    <!-- Active Filters Display -->
    <div v-if="statusFilter !== 'all' || searchQuery" class="flex flex-wrap gap-2">
      <span v-if="statusFilter !== 'all'" class="filter-tag">
        Status: {{ statusFilter }}
        <button @click="statusFilter = 'all'" class="ml-2">×</button>
      </span>
      <span v-if="searchQuery" class="filter-tag">
        Search: {{ searchQuery }}
        <button @click="searchQuery = ''" class="ml-2">×</button>
      </span>
    </div>

    <!-- Game Grid -->
    <div v-if="filteredGamesList.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <GameCard
        v-for="game in filteredGamesList"
        :key="game.id"
        :game="game"
        @update="updateGame"
        @delete="deleteGame"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <div class="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-dark-200 rounded-full flex items-center justify-center">
        <ComputerDesktopIcon class="w-12 h-12 text-gray-400" />
      </div>
      <h3 class="text-xl font-semibold text-gray-900 dark:text-dark-900 mb-2">No games found</h3>
      <p class="text-gray-600 dark:text-dark-600 mb-6">
        {{ searchQuery || statusFilter !== 'all' 
          ? 'Try adjusting your filters or search terms' 
          : 'Start by adding your first game to your library' }}
      </p>
      <button
        v-if="!searchQuery && statusFilter === 'all'"
        @click="showAddGameModal = true"
        class="btn btn-primary"
      >
        Add Your First Game
      </button>
    </div>

    <!-- Add Game Modal -->
    <AddGameModal
      v-if="showAddGameModal"
      @close="showAddGameModal = false"
      @add="handleAddGame"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useGameStore } from '@/stores/games'
import GameCard from '@/components/GameCard.vue'
import AddGameModal from '@/components/AddGameModal.vue'
import { MagnifyingGlassIcon, ComputerDesktopIcon } from '@heroicons/vue/24/outline'

const gameStore = useGameStore()
const searchQuery = ref('')
const statusFilter = ref('all')
const showAddGameModal = ref(false)

const filteredGamesList = computed(() => {
  return gameStore.filteredGames()(statusFilter.value, searchQuery.value)
})

const updateGame = (id, updates) => {
  gameStore.updateGame(id, updates)
}

const deleteGame = (id) => {
  if (confirm('Are you sure you want to delete this game?')) {
    gameStore.deleteGame(id)
  }
}

const handleAddGame = (gameData) => {
  gameStore.addGame(gameData)
  showAddGameModal.value = false
}

// Watch for route changes to reset filters
watch(() => statusFilter.value, () => {
  // Filters are reactive, no additional action needed
})
</script>

<style scoped>
.filter-tag {
  @apply inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300;
}
</style>