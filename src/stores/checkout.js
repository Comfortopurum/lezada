import { defineStore } from 'pinia'
import { reactive, ref, computed, watch } from 'vue'
import api from '@/services/api'
import { useCartStore } from '@/stores/cart'

export const useCheckoutStore = defineStore('checkout', () => {
  const form = reactive(
    JSON.parse(localStorage.getItem('checkoutForm')) || {
      email: '',
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      billingAddress: '',
      paymentMethod: 'card',
      useShippingAsBilling: true,
    },
  )

  const loading = ref(false)
  const error = ref(null)
  const success = ref(false)

  const updateField = (field, value) => {
    form[field] = value
  }

  const clearForm = () => {
    Object.keys(form).forEach((key) => {
      if (typeof form[key] === 'boolean') form[key] = false
      else form[key] = ''
    })

    form.paymentMethod = 'card'
    form.useShippingAsBilling = true

    localStorage.removeItem('checkoutForm')
  }

  watch(
    form,
    () => {
      localStorage.setItem('checkoutForm', JSON.stringify(form))
    },
    { deep: true },
  )

  const shippingAddress = computed(() => {
    const parts = [
      form.address,
      form.city,
      form.state,
      form.postalCode ? `Postal: ${form.postalCode}` : null,
    ].filter(Boolean)

    return parts.join(', ')
  })

  const billingAddress = computed(() => {
    if (form.useShippingAsBilling) return shippingAddress.value
    return form.billingAddress || ''
  })

  const checkout = async () => {
    loading.value = true
    error.value = null
    success.value = false

    try {
      const payload = {
        payment_method: form.paymentMethod === 'cod' ? 'cod' : 'card',
        shipping_address: shippingAddress.value,
        billing_address: billingAddress.value,
      }

      if (!payload.shipping_address) {
        throw { response: { data: { message: 'Shipping address is required.' } } }
      }
      if (!payload.billing_address) {
        throw { response: { data: { message: 'Billing address is required.' } } }
      }

      const res = await api.post('/orders/checkout', payload)

      success.value = true

      const cart = useCartStore()
      cart.clearCart()
      clearForm()

      return res.data
    } catch (err) {
      error.value = err?.response?.data?.message || err?.response?.data || 'Checkout failed'
      console.error('Checkout failed:', err?.response?.data || err)
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    form,
    loading,
    error,
    success,
    shippingAddress,
    billingAddress,
    updateField,
    clearForm,
    checkout,
  }
})
