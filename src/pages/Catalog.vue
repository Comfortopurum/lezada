<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useProductsStore } from '@/stores/products'

const router = useRouter()
const store = useProductsStore()
const { catalogCategories, allLoading } = storeToRefs(store)

onMounted(async () => {
  await store.fetchAllProducts()
})

const goToCategory = (name) => {
  router.push({ name: 'collection', params: { category: encodeURIComponent(name) } })
}
</script>

<template>
  <section class="max-w-7xl mx-auto px-6 py-16">
    <div v-if="allLoading" class="py-20 text-center text-gray-500">Loading catalog...</div>

    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-10">
      <div v-for="c in catalogCategories" :key="c.name" class="text-center">
        <div class="bg-gray-100 p-6">
          <img
            v-if="c.image"
            :src="c.image"
            class="w-full h-105 object-contain bg-[#f6f6f6]"
            alt=""
          />
          <div v-else class="w-full h-105 bg-white flex items-center justify-center text-gray-400">
            No image
          </div>
        </div>

        <h3 class="text-3xl mt-6">{{ c.name }}</h3>
        <p class="text-gray-500 mt-2">{{ c.count }} Products</p>

        <button
          class="mt-5 bg-black text-white px-10 py-3 text-xs cursor-pointer tracking-widest"
          @click="goToCategory(c.name)"
        >
          MORE
        </button>
      </div>
    </div>
  </section>
</template>
