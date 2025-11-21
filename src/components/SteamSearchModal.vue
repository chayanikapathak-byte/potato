<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
    <div class="bg-white dark:bg-dark-100 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-scale-in">
      <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-300">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-dark-900">Search Steam Games</h2>
        <button
          @click="$emit('close')"
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-200 transition-colors"
        >
          <XMarkIcon class="w-5 h-5" />
        </button>
      </div>

      <div class="p-6 border-b border-gray-200 dark:border-dark-300">
        <div class="relative">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            class="input pl-10"
            placeholder="Search for games..."
            @input="handleSearch"
          />
        </div>
      </div>

      <div class="flex-1 overflow-y-auto p-6">
        <div v-if="loading" class="text-center py-8">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p class="mt-4 text-gray-600 dark:text-dark-600">Searching...</p>
        </div>

        <div v-else-if="error" class="text-center py-8 text-red-600 dark:text-red-400">
          {{ error }}
        </div>

        <div v-else-if="searchResults.length === 0 && searchQuery" class="text-center py-8 text-gray-600 dark:text-dark-600">
          No games found. Try a different search term.
        </div>

        <div v-else-if="searchResults.length === 0" class="text-center py-8 text-gray-600 dark:text-dark-600">
          Enter a search term to find games on Steam
        </div>

        <div v-else class="space-y-2">
          <button
            v-for="game in searchResults"
            :key="game.appid"
            @click="selectGame(game)"
            class="w-full p-4 rounded-lg bg-gray-50 dark:bg-dark-200 hover:bg-gray-100 dark:hover:bg-dark-300 transition-colors text-left flex items-center gap-4"
          >
            <img
              v-if="game.logo"
              :src="game.logo"
              :alt="game.name"
              class="w-16 h-16 rounded object-cover"
            />
            <div class="flex-1">
              <h3 class="font-medium text-gray-900 dark:text-dark-900">{{ game.name }}</h3>
              <p class="text-sm text-gray-600 dark:text-dark-600">Steam App ID: {{ game.appid }}</p>
            </div>
          </button>
        </div>
      </div>

      <div v-if="selectedGame" class="border-t border-gray-200 dark:border-dark-300 p-6">
        <div class="flex gap-3">
          <button
            type="button"
            @click="selectedGame = null"
            class="flex-1 btn btn-secondary"
          >
            Back to Search
          </button>
          <button
            @click="addGameFromSteam"
            :disabled="loadingDetails"
            class="flex-1 btn btn-primary"
          >
            {{ loadingDetails ? 'Loading...' : 'Add Game' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { XMarkIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import { searchSteamGames, getSteamGameDetails } from '@/utils/steam'

const emit = defineEmits(['close', 'add'])

const searchQuery = ref('')
const searchResults = ref([])
const selectedGame = ref(null)
const loading = ref(false)
const loadingDetails = ref(false)
const error = ref(null)

let searchTimeout = null

const handleSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  if (!searchQuery.value.trim()) {
    searchResults.value = []
    return
  }

  searchTimeout = setTimeout(async () => {
    try {
      loading.value = true
      error.value = null
      const results = await searchSteamGames(searchQuery.value)
      searchResults.value = results.slice(0, 20)
    } catch (err) {
      error.value = 'Failed to search Steam games. Please try again.'
      console.error('Steam search error:', err)
    } finally {
      loading.value = false
    }
  }, 500)
}

const selectGame = (game) => {
  selectedGame.value = game
}

const addGameFromSteam = async () => {
  if (!selectedGame.value) return

  try {
    loadingDetails.value = true
    const details = await getSteamGameDetails(selectedGame.value.appid)

    const platform = details.platforms.windows ? 'PC' : 
                     details.platforms.mac ? 'Mac' :
                     details.platforms.linux ? 'Linux' : 'PC'

    const gameData = {
      steam_app_id: details.appId,
      title: details.name,
      platform: platform,
      status: 'backlog',
      cover_image: details.headerImage,
      genres: details.genres || [],
      notes: details.description || ''
    }

    emit('add', gameData)
    emit('close')
  } catch (err) {
    error.value = 'Failed to fetch game details. Please try again.'
    console.error('Steam details error:', err)
  } finally {
    loadingDetails.value = false
  }
}
</script>
