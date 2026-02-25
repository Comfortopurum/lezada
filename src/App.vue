<script setup>
import { RouterView } from 'vue-router'
import { useRoute } from 'vue-router'
import { onMounted } from 'vue'
import { useProductsStore } from '@/stores/products'
import AddToCartModal from '@/components/AddToCartModal.vue'
import { ref, provide, watch } from 'vue'
import CompareModal from './components/CompareModal.vue'
import QuickViewModal from '@/components/QuickViewModal.vue'
import { useQuickViewStore } from './stores/quickViewStore'

const quickView = useQuickViewStore()

const showCartModal = ref(false)
const route = useRoute()

provide('openCartModal', () => {
  showCartModal.value = true
})

watch(
  () => route.fullPath,
  () => {
    showCartModal.value = false
  },
)
const productsStore = useProductsStore()

onMounted(() => {
  if (!productsStore.products.length) {
    productsStore.fetchProducts()
  }
})
</script>

<template>
  <RouterView />
  <AddToCartModal v-if="showCartModal" @close="showCartModal = false" />
  <CompareModal />
  <QuickViewModal v-if="quickView.open" :product="quickView.product" @close="quickView.close" />
</template>

<style scoped></style>
