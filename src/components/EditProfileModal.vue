<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
    <div class="bg-white dark:bg-dark-100 rounded-xl shadow-xl w-full max-w-md animate-scale-in">
      <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-300">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-dark-900">Edit Profile</h2>
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
            Display Name
          </label>
          <input
            v-model="form.display_name"
            type="text"
            class="input"
            placeholder="Your display name"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-dark-700 mb-2">
            Bio
          </label>
          <textarea
            v-model="form.bio"
            rows="4"
            class="input resize-none"
            placeholder="Tell us about yourself..."
          ></textarea>
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
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  profile: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'update'])

const form = reactive({
  display_name: props.profile?.display_name || '',
  bio: props.profile?.bio || ''
})

const handleSubmit = () => {
  emit('update', { ...props.profile, ...form })
}
</script>
