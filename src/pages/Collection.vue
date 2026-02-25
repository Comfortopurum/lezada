<script setup>
import { computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useProductsStore } from '@/stores/products'
import ProductCard from '@/components/ProductCard.vue'

const route = useRoute()
const store = useProductsStore()
const { allProducts, allLoading } = storeToRefs(store)

const categoryName = computed(() => decodeURIComponent(route.params.category || ''))

const load = async () => {
  await store.fetchAllProducts()
}

onMounted(load)
watch(() => route.params.category, load)

const productsInCategory = computed(() => {
  const cat = categoryName.value
  return allProducts.value.filter((p) => (p?.category || '') === cat)
})
</script>

<template>
  <section class="max-w-7xl mx-auto px-6 py-16">
    <div v-if="allLoading" class="py-20 text-center text-gray-500">Loading products...</div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
      <ProductCard v-for="p in productsInCategory" :key="p.id" :product="p" />
    </div>
  </section>
</template>
