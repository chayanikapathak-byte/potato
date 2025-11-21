<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
    <div class="bg-white dark:bg-dark-100 rounded-xl shadow-xl w-full max-w-md animate-scale-in">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-300">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-dark-900">Add New Game</h2>
        <button
          @click="$emit('close')"
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-200 transition-colors"
        >
          <XMarkIcon class="w-5 h-5" />
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <!-- Steam Search Button -->
        <button
          type="button"
          @click="showSteamSearch = true"
          class="w-full btn btn-secondary flex items-center justify-center gap-2"
        >
          <MagnifyingGlassIcon class="w-5 h-5" />
          Search Steam Games
        </button>

        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300 dark:border-dark-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white dark:bg-dark-100 text-gray-500 dark:text-dark-500">Or add manually</span>
          </div>
        </div>

        <!-- Title -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-dark-700 mb-2">
            Game Title *
          </label>
          <input
            v-model="form.title"
            type="text"
            required
            class="input"
            placeholder="Enter game title"
          >
        </div>

        <!-- Platform -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-dark-700 mb-2">
            Platform *
          </label>
          <select v-model="form.platform" required class="input">
            <option value="">Select platform</option>
            <option value="PC">PC</option>
            <option value="PlayStation 5">PlayStation 5</option>
            <option value="PlayStation 4">PlayStation 4</option>
            <option value="Xbox Series X/S">Xbox Series X/S</option>
            <option value="Xbox One">Xbox One</option>
            <option value="Nintendo Switch">Nintendo Switch</option>
            <option value="Mobile">Mobile</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <!-- Status -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-dark-700 mb-2">
            Status
          </label>
          <select v-model="form.status" class="input">
            <option value="backlog">Backlog</option>
            <option value="playing">Playing</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <!-- Genres -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-dark-700 mb-2">
            Genres
          </label>
          <div class="flex flex-wrap gap-2 mb-2">
            <span
              v-for="(genre, index) in form.genres"
              :key="index"
              class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
            >
              {{ genre }}
              <button
                type="button"
                @click="removeGenre(index)"
                class="ml-2 text-primary-500 hover:text-primary-700"
              >
                ×
              </button>
            </span>
          </div>
          <div class="flex gap-2">
            <input
              v-model="newGenre"
              type="text"
              class="input flex-1"
              placeholder="Add genre"
              @keydown.enter.prevent="addGenre"
            >
            <button
              type="button"
              @click="addGenre"
              class="btn btn-secondary"
            >
              Add
            </button>
          </div>
        </div>

        <!-- Cover Image URL -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-dark-700 mb-2">
            Cover Image URL
          </label>
          <input
            v-model="form.coverImage"
            type="url"
            class="input"
            placeholder="https://example.com/image.jpg"
          >
        </div>

        <!-- Notes -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-dark-700 mb-2">
            Notes
          </label>
          <textarea
            v-model="form.notes"
            rows="3"
            class="input resize-none"
            placeholder="Add any notes about this game..."
          ></textarea>
        </div>

        <!-- Actions -->
        <div class="flex gap-3 pt-4">
          <button
            type="button"
            @click="$emit('close')"
            class="flex-1 btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="!form.title || !form.platform"
            class="flex-1 btn btn-primary"
          >
            Add Game
          </button>
        </div>
      </form>
    </div>

    <SteamSearchModal
      v-if="showSteamSearch"
      @close="showSteamSearch = false"
      @add="handleSteamAdd"
    />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { XMarkIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import SteamSearchModal from './SteamSearchModal.vue'

const emit = defineEmits(['close', 'add'])

const showSteamSearch = ref(false)

const form = reactive({
  title: '',
  platform: '',
  status: 'backlog',
  genres: [],
  coverImage: '',
  notes: ''
})

const newGenre = ref('')

const addGenre = () => {
  if (newGenre.value.trim() && !form.genres.includes(newGenre.value.trim())) {
    form.genres.push(newGenre.value.trim())
    newGenre.value = ''
  }
}

const removeGenre = (index) => {
  form.genres.splice(index, 1)
}

const handleSubmit = () => {
  if (!form.title || !form.platform) return

  // Generate a random cover image if none provided
  if (!form.coverImage) {
    const randomSeed = Math.random().toString(36).substring(7)
    form.coverImage = `https://picsum.photos/seed/${randomSeed}/300/400.jpg`
  }

  emit('add', { 
    ...form,
    cover_image: form.coverImage
  })
  
  // Reset form
  Object.assign(form, {
    title: '',
    platform: '',
    status: 'backlog',
    genres: [],
    coverImage: '',
    notes: ''
  })
}

const handleSteamAdd = (gameData) => {
  showSteamSearch.value = false
  emit('add', gameData)
  emit('close')
}
</script>