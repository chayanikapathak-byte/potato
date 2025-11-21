<template>
  <div class="min-h-[80vh] flex items-center justify-center px-4">
    <div class="w-full max-w-md">
      <div class="card p-8 animate-scale-in">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-dark-900 mb-2">
            Create Account
          </h1>
          <p class="text-gray-600 dark:text-dark-600">
            Start tracking your gaming journey today
          </p>
        </div>

        <form @submit.prevent="handleSignup" class="space-y-6">
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
              minlength="3"
              class="input"
              placeholder="Choose a username"
              autocomplete="username"
            />
            <p class="text-xs text-gray-500 dark:text-dark-500 mt-1">
              At least 3 characters
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-dark-700 mb-2">
              Password
            </label>
            <input
              v-model="password"
              type="password"
              required
              minlength="6"
              class="input"
              placeholder="Choose a password"
              autocomplete="new-password"
            />
            <p class="text-xs text-gray-500 dark:text-dark-500 mt-1">
              At least 6 characters
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-dark-700 mb-2">
              Confirm Password
            </label>
            <input
              v-model="confirmPassword"
              type="password"
              required
              minlength="6"
              class="input"
              placeholder="Confirm your password"
              autocomplete="new-password"
            />
          </div>

          <div v-if="password && confirmPassword && password !== confirmPassword" class="text-sm text-red-600 dark:text-red-400">
            Passwords do not match
          </div>

          <button
            type="submit"
            :disabled="authStore.loading || !username || !password || password !== confirmPassword"
            class="w-full btn btn-primary"
          >
            {{ authStore.loading ? 'Creating account...' : 'Sign Up' }}
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600 dark:text-dark-600">
            Already have an account?
            <router-link to="/login" class="text-primary-600 hover:text-primary-700 font-medium">
              Sign in
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
const confirmPassword = ref('')

const handleSignup = async () => {
  if (password.value !== confirmPassword.value) {
    return
  }

  const success = await authStore.signup(username.value, password.value)
  if (success) {
    router.push('/')
  }
}
</script>
