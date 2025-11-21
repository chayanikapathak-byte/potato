<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
    <div class="bg-white dark:bg-dark-100 rounded-xl shadow-xl w-full max-w-md animate-scale-in">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-300">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-dark-900">Edit Game</h2>
        <button
          @click="$emit('close')"
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-200 transition-colors"
        >
          <XMarkIcon class="w-5 h-5" />
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
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

        <!-- Progress (for playing games) -->
        <div v-if="form.status === 'playing'">
          <label class="block text-sm font-medium text-gray-700 dark:text-dark-700 mb-2">
            Progress: {{ form.progress }}%
          </label>
          <input
            v-model.number="form.progress"
            type="range"
            min="0"
            max="100"
            step="5"
            class="w-full"
          >
        </div>

        <!-- Playtime -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-dark-700 mb-2">
            Playtime (hours)
          </label>
          <input
            v-model.number="form.playtime"
            type="number"
            min="0"
            step="0.5"
            class="input"
            placeholder="0"
          >
        </div>

        <!-- Rating -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-dark-700 mb-2">
            Rating
          </label>
          <div class="flex space-x-2">
            <button
              v-for="i in 5"
              :key="i"
              type="button"
              @click="form.rating = form.rating === i ? null : i"
              class="p-1 transition-colors"
              :class="i <= form.rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-200'"
            >
              <StarIcon class="w-6 h-6" />
            </button>
          </div>
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
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { XMarkIcon, StarIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  game: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'update'])

const form = reactive({
  title: '',
  platform: '',
  status: 'backlog',
  progress: 0,
  playtime: 0,
  rating: null,
  genres: [],
  coverImage: '',
  notes: ''
})

const newGenre = ref('')

// Initialize form with game data
watch(() => props.game, (game) => {
  if (game) {
    Object.assign(form, {
      title: game.title,
      platform: game.platform,
      status: game.status,
      progress: game.progress || 0,
      playtime: game.playtime || 0,
      rating: game.rating,
      genres: [...(game.genres || [])],
      coverImage: game.coverImage || '',
      notes: game.notes || ''
    })
  }
}, { immediate: true })

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

  const updates = { ...form }
  
  // Auto-adjust progress and dates based on status
  if (form.status === 'completed') {
    updates.progress = 100
    if (!props.game.completedDate) {
      updates.completedDate = new Date().toISOString().split('T')[0]
    }
  } else if (form.status === 'playing' && !props.game.startedDate) {
    updates.startedDate = new Date().toISOString().split('T')[0]
  }

  emit('update', updates)
}
</script>