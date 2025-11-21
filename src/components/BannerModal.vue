<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
    <div class="bg-white dark:bg-dark-100 rounded-xl shadow-xl w-full max-w-md animate-scale-in">
      <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-300">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-dark-900">Change Banner</h2>
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
            Banner Image URL
          </label>
          <input
            v-model="bannerUrl"
            type="url"
            class="input"
            placeholder="https://example.com/banner.jpg"
          />
          <p class="text-xs text-gray-500 dark:text-dark-500 mt-1">
            Enter a URL to an image. Recommended size: 1200x300px
          </p>
        </div>

        <div v-if="bannerUrl" class="overflow-hidden rounded-lg">
          <img
            :src="bannerUrl"
            alt="Preview"
            class="w-full h-32 object-cover"
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
  currentBanner: String
})

const emit = defineEmits(['close', 'update'])

const bannerUrl = ref(props.currentBanner || '')
const imageError = ref(false)

watch(bannerUrl, () => {
  imageError.value = false
})

const handleSubmit = () => {
  emit('update', bannerUrl.value)
}
</script>
