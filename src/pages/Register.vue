<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { RouterLink } from 'vue-router'

const name = ref('')
const email = ref('')
const password = ref('')

const errorMsg = ref('')
const loading = ref(false)

const auth = useAuthStore()
const router = useRouter()

const submit = async () => {
  errorMsg.value = ''
  loading.value = true

  const ok = await auth.register(name.value, email.value, password.value)

  loading.value = false

  if (ok) router.push('/')
  else errorMsg.value = auth.error || 'Registration failed'
}
</script>

<template>
  <div class="bg-white py-20">
    <div class="max-w-md mx-auto bg-[#f6f6f6] p-10">
      <h2 class="text-3xl text-center mb-6">Create Account</h2>

      <div class="space-y-6">
        <input v-model="name" placeholder="Name" class="w-full p-3 border mb-6" />
        <input v-model="email" type="email" placeholder="Email" class="w-full p-3 border mb-6" />
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="w-full p-3 border mb-6"
        />
      </div>

      <p v-if="auth.error" class="text-red-500 text-sm">{{ auth.error }}</p>

      <button class="mt-8 bg-black text-white w-full mb-3 py-3" :disabled="loading" @click="submit">
        {{ loading ? 'Creating...' : 'CREATE ACCOUNT' }}
      </button>
      <RouterLink to="/login">
        <div class="cursor-pointer">Already a User? Log in</div>
      </RouterLink>
    </div>
  </div>
</template>
