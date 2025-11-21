<template>
  <div class="min-h-[80vh] flex items-center justify-center px-4">
    <div class="w-full max-w-md">
      <div class="card p-8 animate-scale-in">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-dark-900 mb-2">
            Welcome Back
          </h1>
          <p class="text-gray-600 dark:text-dark-600">
            Sign in to continue tracking your games
          </p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div v-if="authStore.error" class="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg text-sm">
            {{ authStore.error }}
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-dark-700 mb-2">
              Username
            </label>
            <input
              v-model="username"
              type="text"
              required
              class="input"
              placeholder="Enter your username"
              autocomplete="username"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-dark-700 mb-2">
              Password
            </label>
            <input
              v-model="password"
              type="password"
              required
              class="input"
              placeholder="Enter your password"
              autocomplete="current-password"
            />
          </div>

          <button
            type="submit"
            :disabled="authStore.loading || !username || !password"
            class="w-full btn btn-primary"
          >
            {{ authStore.loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600 dark:text-dark-600">
            Don't have an account?
            <router-link to="/signup" class="text-primary-600 hover:text-primary-700 font-medium">
              Sign up
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')

const handleLogin = async () => {
  const success = await authStore.login(username.value, password.value)
  if (success) {
    router.push('/')
  }
}
</script>
