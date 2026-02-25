import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])
  const loading = ref(false)
  const error = ref(null)

  const totalItems = computed(() =>
    items.value.reduce((sum, item) => sum + Number(item.quantity ?? 0), 0),
  )

  const totalPrice = computed(() =>
    items.value.reduce(
      (sum, item) => sum + Number(item.price ?? 0) * Number(item.quantity ?? 0),
      0,
    ),
  )

  const fetchCart = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await api.get('/cart')
      // IMPORTANT: API returns { status, data: [...] }
      items.value = Array.isArray(res.data?.data) ? res.data.data : []
      return true
    } catch (err) {
      error.value = err?.response?.data?.message || 'Failed to load cart'
      items.value = []
      return false
    } finally {
      loading.value = false
    }
  }

  // POST /cart/add { product_id, quantity }
  const addToCart = async (productId, quantity = 1) => {
    loading.value = true
    error.value = null
    try {
      await api.post('/cart/add', { product_id: productId, quantity })
      await fetchCart()
      return true
    } catch (err) {
      error.value = err?.response?.data?.message || 'Add to cart failed'
      return false
    } finally {
      loading.value = false
    }
  }

  // PUT /cart/{cart_id} { type: "increment" | "decrement" }
  const updateCart = async (cartId, type) => {
    loading.value = true
    error.value = null
    try {
      await api.put(`/cart/${cartId}`, { type })
      await fetchCart()
      return true
    } catch (err) {
      error.value = err?.response?.data?.message || 'Update cart failed'
      return false
    } finally {
      loading.value = false
    }
  }

  // DELETE /cart/{cart_id}
  const removeFromCart = async (cartId) => {
    loading.value = true
    error.value = null
    try {
      await api.delete(`/cart/${cartId}`)
      await fetchCart()
      return true
    } catch (err) {
      error.value = err?.response?.data?.message || 'Remove from cart failed'
      return false
    } finally {
      loading.value = false
    }
  }

  const clearCart = async () => {
    // no backend endpoint shown, so delete one-by-one
    await Promise.all(items.value.map((i) => removeFromCart(i.cart_id)))
  }

  return {
    items,
    loading,
    error,
    totalItems,
    totalPrice,
    fetchCart,
    addToCart,
    updateCart,
    removeFromCart,
    clearCart,
  }
})
