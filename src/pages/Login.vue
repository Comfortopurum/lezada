<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter, useRoute } from 'vue-router'

const email = ref('')
const password = ref('')
const errorMsg = ref('')

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const submit = async () => {
  errorMsg.value = ''

  const ok = await auth.login(email.value, password.value)

  if (ok) {
    router.push(route.query.redirect || '/')
  } else {
    errorMsg.value = auth.error || 'Login failed'
  }
}
</script>

<template>
  <div class="bg-white py-20">
    <div class="max-w-md mx-auto py-12 bg-[#f6f6f6] px-10">
      <h2 class="text-2xl mb-2 text-center">Login</h2>

      <p v-if="errorMsg" class="text-red-500 text-sm mb-4">{{ errorMsg }}</p>

      <input
        v-model="email"
        placeholder="Email"
        class="border p-3 w-full mb-4"
        @keydown.enter="submit"
      />

      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="border p-3 w-full mb-6"
        @keydown.enter="submit"
      />

      <button
        class="bg-black text-white w-2/4 py-3 mb-4 disabled:opacity-50"
        :disabled="auth.loading"
        @click="submit"
      >
        {{ auth.loading ? 'SIGNING IN...' : 'SIGN IN' }}
      </button>
    </div>
  </div>
</template>
