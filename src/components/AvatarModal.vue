<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
    <div class="bg-white dark:bg-dark-100 rounded-xl shadow-xl w-full max-w-md animate-scale-in">
      <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-300">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-dark-900">Change Avatar</h2>
        <button
          @click="$emit('close')"
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-200 transition-colors"
        >
          <XMarkIcon class="w-5 h-5" />
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-dark-700 mb-2">
            Avatar URL
          </label>
          <input
            v-model="avatarUrl"
            type="url"
            class="input"
            placeholder="https://example.com/avatar.jpg"
          />
          <p class="text-xs text-gray-500 dark:text-dark-500 mt-1">
            Enter a URL to an image or leave blank to use your initial
          </p>
        </div>

        <div v-if="avatarUrl" class="flex justify-center">
          <img
            :src="avatarUrl"
            alt="Preview"
            class="w-32 h-32 rounded-full object-cover"
            @error="imageError = true"
          />
        </div>

        <div v-if="imageError" class="text-sm text-red-600 dark:text-red-400">
          Failed to load image. Please check the URL.
        </div>

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
            class="flex-1 btn btn-primary"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  currentAvatar: String
})

const emit = defineEmits(['close', 'update'])

const avatarUrl = ref(props.currentAvatar || '')
const imageError = ref(false)

watch(avatarUrl, () => {
  imageError.value = false
})

const handleSubmit = () => {
  emit('update', avatarUrl.value)
}
</script>
