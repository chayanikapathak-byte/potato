<template>
  <div class="space-y-8 animate-fade-in">
    <div class="relative">
      <div 
        class="h-48 rounded-xl bg-gradient-to-r from-primary-500 to-purple-600 relative overflow-hidden"
        :style="profile ? { backgroundImage: `url(${profile.banner_image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}"
      >
        <button
          @click="showBannerModal = true"
          class="absolute bottom-4 right-4 btn btn-secondary text-sm"
        >
          Change Banner
        </button>
      </div>

      <div class="relative px-6 -mt-16">
        <div class="flex flex-col sm:flex-row items-center sm:items-end gap-4">
          <div class="relative">
            <div
              class="w-32 h-32 rounded-full border-4 border-white dark:border-dark-100 bg-gray-200 dark:bg-dark-200 overflow-hidden"
            >
              <img
                v-if="profile?.avatar_url"
                :src="profile.avatar_url"
                alt="Avatar"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-400">
                {{ profile?.username?.charAt(0).toUpperCase() }}
              </div>
            </div>
            <button
              @click="showAvatarModal = true"
              class="absolute bottom-2 right-2 p-2 rounded-full bg-primary-600 text-white hover:bg-primary-700 transition-colors"
            >
              <PencilIcon class="w-4 h-4" />
            </button>
          </div>

          <div class="text-center sm:text-left flex-1">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-dark-900">
              {{ profile?.display_name || profile?.username || 'Loading...' }}
            </h1>
            <p class="text-gray-600 dark:text-dark-600">
              @{{ profile?.username }}
            </p>
          </div>

          <button
            @click="showEditModal = true"
            class="btn btn-primary"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>

    <div class="grid md:grid-cols-2 gap-6">
      <div class="card p-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-dark-900 mb-4">
          About
        </h2>
        <p class="text-gray-600 dark:text-dark-600 whitespace-pre-wrap">
          {{ profile?.bio || 'No bio yet. Click "Edit Profile" to add one!' }}
        </p>
      </div>

      <div class="card p-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-dark-900 mb-4">
          Gaming Stats
        </h2>
        <div class="space-y-3">
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-dark-600">Total Games</span>
            <span class="font-semibold text-gray-900 dark:text-dark-900">{{ stats.total }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-dark-600">Completed</span>
            <span class="font-semibold text-gray-900 dark:text-dark-900">{{ stats.completed }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-dark-600">Total Playtime</span>
            <span class="font-semibold text-gray-900 dark:text-dark-900">{{ stats.totalPlaytime }}h</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-dark-600">Avg Rating</span>
            <span class="font-semibold text-gray-900 dark:text-dark-900">{{ stats.avgRating }}/5.0</span>
          </div>
        </div>
      </div>
    </div>

    <div class="card p-6">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-dark-900 mb-4">
        Theme Color
      </h2>
      <div class="flex flex-wrap gap-3">
        <button
          v-for="color in themeColors"
          :key="color.value"
          @click="updateThemeColor(color.value)"
          class="w-12 h-12 rounded-full border-2 transition-all"
          :style="{ backgroundColor: color.value }"
          :class="profile?.theme_color === color.value ? 'border-gray-900 dark:border-white scale-110' : 'border-gray-300 dark:border-dark-300'"
        >
        </button>
      </div>
    </div>

    <EditProfileModal
      v-if="showEditModal"
      :profile="profile"
      @close="showEditModal = false"
      @update="handleProfileUpdate"
    />

    <AvatarModal
      v-if="showAvatarModal"
      :current-avatar="profile?.avatar_url"
      @close="showAvatarModal = false"
      @update="handleAvatarUpdate"
    />

    <BannerModal
      v-if="showBannerModal"
      :current-banner="profile?.banner_image"
      @close="showBannerModal = false"
      @update="handleBannerUpdate"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { PencilIcon } from '@heroicons/vue/24/outline'
import { useProfileStore } from '@/stores/profile'
import { useGameStore } from '@/stores/games'
import EditProfileModal from '@/components/EditProfileModal.vue'
import AvatarModal from '@/components/AvatarModal.vue'
import BannerModal from '@/components/BannerModal.vue'

const profileStore = useProfileStore()
const gameStore = useGameStore()

const showEditModal = ref(false)
const showAvatarModal = ref(false)
const showBannerModal = ref(false)

const profile = computed(() => profileStore.profile)
const stats = computed(() => gameStore.stats)

const themeColors = [
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Purple', value: '#9333ea' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Yellow', value: '#eab308' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Teal', value: '#14b8a6' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Cyan', value: '#06b6d4' },
]

const updateThemeColor = async (color) => {
  try {
    await profileStore.updateProfile({ ...profile.value, theme_color: color })
  } catch (error) {
    console.error('Failed to update theme color:', error)
  }
}

const handleProfileUpdate = async (updates) => {
  try {
    await profileStore.updateProfile(updates)
    showEditModal.value = false
  } catch (error) {
    console.error('Failed to update profile:', error)
  }
}

const handleAvatarUpdate = async (avatarUrl) => {
  try {
    await profileStore.updateProfile({ ...profile.value, avatar_url: avatarUrl })
    showAvatarModal.value = false
  } catch (error) {
    console.error('Failed to update avatar:', error)
  }
}

const handleBannerUpdate = async (bannerUrl) => {
  try {
    await profileStore.updateProfile({ ...profile.value, banner_image: bannerUrl })
    showBannerModal.value = false
  } catch (error) {
    console.error('Failed to update banner:', error)
  }
}

onMounted(() => {
  profileStore.fetchProfile()
  gameStore.fetchGames()
})
</script>
