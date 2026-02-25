import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useWishlistStore = defineStore('wishlist', () => {
  const items = ref(JSON.parse(localStorage.getItem('wishlist')) || [])

  const toggle = (product) => {
    const index = items.value.findIndex((p) => p.id === product.id)

    if (index !== -1) {
      items.value.splice(index, 1)
    } else {
      items.value.push(product)
    }
  }

  const isInWishlist = (id) => {
    return items.value.some((p) => p.id === id)
  }

  watch(
    items,
    (val) => {
      localStorage.setItem('wishlist', JSON.stringify(val))
    },
    { deep: true },
  )

  return {
    items,
    toggle,
    isInWishlist,
  }
})
