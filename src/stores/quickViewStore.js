import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useQuickViewStore = defineStore('quickView', () => {
  const open = ref(false)
  const product = ref(null)

  const show = (payload) => {
    product.value = payload
    open.value = true
  }

  const close = () => {
    open.value = false
    product.value = null
  }

  return {
    open,
    product,
    show,
    close,
  }
})
