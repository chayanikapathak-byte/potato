<template>
  <div class="card overflow-hidden transition-all duration-200 hover:shadow-lg group">
    <!-- Game Cover -->
    <div class="relative aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-dark-200">
      <img
        :src="game.coverImage"
        :alt="game.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
      >
      
      <!-- Status Badge -->
      <div class="absolute top-2 right-2">
        <span
          class="px-2 py-1 text-xs font-medium rounded-full backdrop-blur-sm"
          :class="getStatusBadgeClass(game.status)"
        >
          {{ getStatusText(game.status) }}
        </span>
      </div>

      <!-- Progress Overlay -->
      <div v-if="game.status === 'playing' && game.progress > 0" class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
        <div class="text-white text-sm font-medium mb-2">{{ game.progress }}% Complete</div>
        <div class="w-full bg-white/20 rounded-full h-2">
          <div
            class="bg-white h-2 rounded-full transition-all duration-300"
            :style="{ width: `${game.progress}%` }"
          ></div>
        </div>
      </div>

      <!-- Rating Badge -->
      <div v-if="game.rating" class="absolute top-2 left-2 flex items-center space-x-1 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1">
        <StarIcon class="w-3 h-3 text-yellow-400" />
        <span class="text-xs text-white font-medium">{{ game.rating }}</span>
      </div>
    </div>

    <!-- Game Info -->
    <div class="p-4">
      <h3 class="font-semibold text-gray-900 dark:text-dark-900 mb-1 line-clamp-2">{{ game.title }}</h3>
      <p class="text-sm text-gray-600 dark:text-dark-600 mb-3">{{ game.platform }}</p>
      
      <!-- Genres -->
      <div class="flex flex-wrap gap-1 mb-3">
        <span
          v-for="genre in game.genres.slice(0, 2)"
          :key="genre"
          class="text-xs px-2 py-1 bg-gray-100 dark:bg-dark-300 text-gray-700 dark:text-dark-700 rounded-full"
        >
          {{ genre }}
        </span>
        <span
          v-if="game.genres.length > 2"
          class="text-xs px-2 py-1 bg-gray-100 dark:bg-dark-300 text-gray-700 dark:text-dark-700 rounded-full"
        >
          +{{ game.genres.length - 2 }}
        </span>
      </div>

      <!-- Playtime -->
      <div class="text-sm text-gray-600 dark:text-dark-600 mb-4">
        <ClockIcon class="w-4 h-4 inline mr-1" />
        {{ game.playtime }} hours
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-2">
        <button
          @click="showDetails = !showDetails"
          class="flex-1 btn btn-secondary text-sm"
        >
          {{ showDetails ? 'Hide' : 'Details' }}
        </button>
        <button
          @click="showEditModal = true"
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-200 transition-colors"
          title="Edit game"
        >
          <PencilIcon class="w-4 h-4" />
        </button>
        <button
          @click="handleDelete"
          class="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 transition-colors"
          title="Delete game"
        >
          <TrashIcon class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Expanded Details -->
    <div v-if="showDetails" class="border-t border-gray-200 dark:border-dark-300 p-4 bg-gray-50 dark:bg-dark-200">
      <div class="space-y-3">
        <!-- Progress Update for Playing Games -->
        <div v-if="game.status === 'playing'">
          <label class="block text-sm font-medium text-gray-700 dark:text-dark-700 mb-2">
            Update Progress
          </label>
          <div class="flex items-center space-x-2">
            <input
              v-model.number="localProgress"
              type="range"
              min="0"
              max="100"
              step="5"
              class="flex-1"
              @input="updateProgress"
            >
            <span class="text-sm font-medium w-12 text-right">{{ localProgress }}%</span>
          </div>
        </div>

        <!-- Status Change -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-dark-700 mb-2">
            Status
          </label>
          <select v-model="localStatus" @change="updateStatus" class="input text-sm">
            <option value="backlog">Backlog</option>
            <option value="playing">Playing</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <!-- Rating -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-dark-700 mb-2">
            Rating
          </label>
          <div class="flex space-x-1">
            <button
              v-for="i in 5"
              :key="i"
              @click="setRating(i)"
              class="p-1 transition-colors"
              :class="i <= localRating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-200'"
            >
              <StarIcon class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Notes -->
        <div v-if="game.notes">
          <label class="block text-sm font-medium text-gray-700 dark:text-dark-700 mb-2">
            Notes
          </label>
          <p class="text-sm text-gray-600 dark:text-dark-600">{{ game.notes }}</p>
        </div>

        <!-- Dates -->
        <div class="text-xs text-gray-500 dark:text-dark-500 space-y-1">
          <div v-if="game.startedDate">
            Started: {{ formatDate(game.startedDate) }}
          </div>
          <div v-if="game.completedDate">
            Completed: {{ formatDate(game.completedDate) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <EditGameModal
      v-if="showEditModal"
      :game="game"
      @close="showEditModal = false"
      @update="handleUpdate"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { StarIcon, ClockIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/outline'
import EditGameModal from './EditGameModal.vue'

const props = defineProps({
  game: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update', 'delete'])

const showDetails = ref(false)
const showEditModal = ref(false)
const localProgress = ref(props.game.progress)
const localStatus = ref(props.game.status)
const localRating = ref(props.game.rating)

const getStatusText = (status) => {
  const statusMap = {
    playing: 'Playing',
    completed: 'Completed',
    backlog: 'Backlog'
  }
  return statusMap[status] || status
}

const getStatusBadgeClass = (status) => {
  const classes = {
    playing: 'bg-blue-500/90 text-white',
    completed: 'bg-green-500/90 text-white',
    backlog: 'bg-yellow-500/90 text-white'
  }
  return classes[status] || 'bg-gray-500/90 text-white'
}

const updateProgress = () => {
  emit('update', props.game.id, { progress: localProgress.value })
}

const updateStatus = () => {
  const updates = { status: localStatus.value }
  
  if (localStatus.value === 'playing' && !props.game.startedDate) {
    updates.startedDate = new Date().toISOString().split('T')[0]
  }
  
  if (localStatus.value === 'completed' && !props.game.completedDate) {
    updates.progress = 100
    updates.completedDate = new Date().toISOString().split('T')[0]
  }
  
  emit('update', props.game.id, updates)
}

const setRating = (rating) => {
  localRating.value = localRating.value === rating ? null : rating
  emit('update', props.game.id, { rating: localRating.value })
}

const handleUpdate = (updates) => {
  emit('update', props.game.id, updates)
  showEditModal.value = false
}

const handleDelete = () => {
  if (confirm(`Are you sure you want to delete "${props.game.title}"?`)) {
    emit('delete', props.game.id)
  }
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
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>