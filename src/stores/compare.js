import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCompareStore = defineStore('compare', () => {
  const isOpen = ref(false)
  const products = ref([])

  const openCompare = (baseProduct, allProducts) => {
    const sameCategory = allProducts.filter(
      (p) => p.category === baseProduct.category && p.id !== baseProduct.id,
    )

    products.value = [baseProduct, ...sameCategory.slice(0, 3)]
    isOpen.value = true
  }

  const removeProduct = (id) => {
    products.value = products.value.filter((p) => p.id !== id)
  }

  const close = () => {
    isOpen.value = false
    products.value = []
  }

  return {
    isOpen,
    products,
    openCompare,
    removeProduct,
    close,
  }
})
