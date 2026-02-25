<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

const route = useRoute()

const pageLabel = computed(() => {
  if (route.name === 'product' && product.value) {
    return product.value.title
  }
  return route.meta.label
})
const collectionName = computed(() => decodeURIComponent(route.params.category || pageLabel.value))
</script>

<template>
  <div>
    <Navbar />

    <div v-if="pageLabel" class="bg-[#f6f6f6] py-10 mt-20">
      <div class="max-w-7xl mx-auto px-6">
        <h1 class="text-5xl font-light mb-6">
          {{ pageLabel }}
        </h1>

        <p class="text-sm text-gray-500">
          Home /
          <span class="text-gray-800"> {{ collectionName }}</span>
        </p>
      </div>
    </div>

    <main class="max-w-7xl mx-auto">
      <RouterView />
    </main>

    <Footer />
  </div>
</template>
