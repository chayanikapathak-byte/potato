<template>
  <nav class="sticky top-0 z-50 bg-white/80 dark:bg-dark-100/80 backdrop-blur-lg border-b border-gray-200 dark:border-dark-300">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo and Brand -->
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/>
            </svg>
          </div>
          <h1 class="text-xl font-bold text-gray-900 dark:text-dark-900">Game Tracker</h1>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-1">
          <router-link
            v-for="item in navigation"
            :key="item.name"
            :to="item.to"
            class="nav-link"
            :class="{ 'nav-link-active': $route.name === item.name }"
          >
            <component :is="item.icon" class="w-5 h-5" />
            <span>{{ item.name }}</span>
          </router-link>
        </div>

        <!-- Right side actions -->
        <div class="flex items-center space-x-3">
          <!-- Theme Toggle -->
          <button
            @click="themeStore.toggleTheme"
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-200 transition-colors"
            :title="themeStore.isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          >
            <SunIcon v-if="themeStore.isDark" class="w-5 h-5 text-gray-600 dark:text-dark-600" />
            <MoonIcon v-else class="w-5 h-5 text-gray-600" />
          </button>

          <!-- User Menu (Desktop) -->
          <div v-if="authStore.isAuthenticated" class="hidden md:flex items-center space-x-2">
            <router-link
              to="/profile"
              class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-200 transition-colors"
              title="Profile"
            >
              <UserCircleIcon class="w-5 h-5 text-gray-600 dark:text-dark-600" />
            </router-link>
            <button
              @click="handleLogout"
              class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-200 transition-colors"
              title="Logout"
            >
              <ArrowRightOnRectangleIcon class="w-5 h-5 text-gray-600 dark:text-dark-600" />
            </button>
          </div>

          <!-- Mobile Menu Button -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-200 transition-colors"
          >
            <Bars3Icon v-if="!mobileMenuOpen" class="w-5 h-5" />
            <XMarkIcon v-else class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <div v-if="mobileMenuOpen" class="md:hidden py-4 border-t border-gray-200 dark:border-dark-300">
        <div class="flex flex-col space-y-1">
          <router-link
            v-for="item in navigation"
            :key="item.name"
            :to="item.to"
            class="mobile-nav-link"
            :class="{ 'mobile-nav-link-active': $route.name === item.name }"
            @click="mobileMenuOpen = false"
          >
            <component :is="item.icon" class="w-5 h-5" />
            <span>{{ item.name }}</span>
          </router-link>
          
          <div v-if="authStore.isAuthenticated" class="pt-2 mt-2 border-t border-gray-200 dark:border-dark-300">
            <router-link
              to="/profile"
              class="mobile-nav-link"
              :class="{ 'mobile-nav-link-active': $route.name === 'Profile' }"
              @click="mobileMenuOpen = false"
            >
              <UserCircleIcon class="w-5 h-5" />
              <span>Profile</span>
            </router-link>
            <button
              @click="handleLogout"
              class="mobile-nav-link w-full text-left"
            >
              <ArrowRightOnRectangleIcon class="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import { useAuthStore } from '@/stores/auth'
import {
  HomeIcon,
  BookOpenIcon,
  ChartBarIcon,
  MoonIcon,
  SunIcon,
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const themeStore = useThemeStore()
const authStore = useAuthStore()
const mobileMenuOpen = ref(false)

const navigation = [
  { name: 'Home', to: '/', icon: HomeIcon },
  { name: 'Library', to: '/library', icon: BookOpenIcon },
  { name: 'Stats', to: '/stats', icon: ChartBarIcon },
]

const handleLogout = () => {
  authStore.logout()
  mobileMenuOpen.value = false
  router.push('/login')
}
</script>

<style scoped>
.nav-link {
  @apply flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-dark-600 hover:text-gray-900 dark:hover:text-dark-900 hover:bg-gray-100 dark:hover:bg-dark-200 transition-all duration-200;
}

.nav-link-active {
  @apply text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20;
}

.mobile-nav-link {
  @apply flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium text-gray-600 dark:text-dark-600 hover:text-gray-900 dark:hover:text-dark-900 hover:bg-gray-100 dark:hover:bg-dark-200 transition-all duration-200;
}

.mobile-nav-link-active {
  @apply text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20;
}
</style>