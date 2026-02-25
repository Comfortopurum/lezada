<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useProductsStore } from '@/stores/products'
import ProductCard from '@/components/ProductCard.vue'

const store = useProductsStore()
const { products, gridCols, sortBy } = storeToRefs(store)

const gridClass = computed(() => {
  if (gridCols.value === 2) return 'grid grid-cols-1 sm:grid-cols-2 gap-10'
  if (gridCols.value === 4) return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10'
  return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10'
})

const displayProducts = computed(() => {
  const list = Array.isArray(products.value) ? [...products.value] : []

  if (sortBy.value === 'az')
    return list.sort((a, b) => String(a.name ?? '').localeCompare(String(b.name ?? '')))

  if (sortBy.value === 'za')
    return list.sort((a, b) => String(b.name ?? '').localeCompare(String(a.name ?? '')))

  if (sortBy.value === 'price_asc')
    return list.sort((a, b) => Number(a.price ?? 0) - Number(b.price ?? 0))

  if (sortBy.value === 'price_desc')
    return list.sort((a, b) => Number(b.price ?? 0) - Number(a.price ?? 0))

  return list
})
</script>

<template>
  <div :class="gridClass">
    <ProductCard v-for="product in displayProducts" :key="product.id" :product="product" />
  </div>
</template>
