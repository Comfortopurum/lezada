<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProductsStore } from '@/stores/products'
import ProductCard from './ProductCard.vue'
import { storeToRefs } from 'pinia'

const store = useProductsStore()
const { loading, products, tab } = storeToRefs(store)

const tabs = [
  { label: 'New', value: 'new' },
  { label: 'Popular', value: 'popular' },
  { label: 'Sale', value: 'sale' },
]

const activeTab = ref('Popular')

onMounted(async () => {
  tab.value = activeTab.value
  if (!products.value.length) {
    await store.fetchProducts(1)
  }
})

const onTabClick = async (value) => {
  activeTab.value = value
  await store.setTab(value)
}
</script>

<template>
  <section class="max-w-7xl mx-auto px-6 py-24">
    <div v-if="loading" class="py-20 text-center text-gray-500">Loading ...</div>

    <div v-else>
      <div class="flex justify-center gap-12 mb-16 text-3xl">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          @click="onTabClick(tab.value)"
          class="transition"
          :class="activeTab === tab.value ? 'text-black' : 'text-gray-300 hover:text-gray-500'"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="grid md:grid-cols-3 gap-12">
        <ProductCard v-for="product in products" :key="product.id" :product="product" />
      </div>
    </div>
  </section>
</template>
