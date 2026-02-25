<script setup>
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { RouterLink, useRouter } from 'vue-router'
import { useCheckoutStore } from '@/stores/checkout'
import { useToast } from 'vue-toastification'

const checkout = useCheckoutStore()
const toast = useToast()
const cart = useCartStore()
const router = useRouter()

const subtotal = computed(() =>
  cart.items.reduce((sum, item) => {
    const qty = Number(item.qty || 1)
    const price = Number(item.price || 0)
    return sum + price * qty
  }, 0),
)
const cartBadgeCount = computed(() => cart.totalItems ?? 0)

const shipping = 20
const total = computed(() => subtotal.value + shipping)

const payNow = async () => {
  if (!cart.items.length) return

  const res = await checkout.checkout()
  if (res) {
    toast.success('Payment successful! Redirecting to home...')

    setTimeout(() => {
      router.push('/')
    }, 1500)
  }
}
</script>

<template>
  <div class="min-h-screen bg-white">
    <div class="max-w-7xl mx-auto px-6 py-12">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div class="space-y-12">
          <section>
            <div class="flex justify-between items-center mb-3">
              <h2 class="text-lg font-semibold">Contact</h2>
              <RouterLink to="/login" class="text-sm underline">Sign in</RouterLink>
            </div>

            <input
              v-model="checkout.form.email"
              @input="checkout.updateField('email', checkout.form.email)"
              placeholder="Email"
            />

            <label class="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" />
              Email me with news and offers
            </label>
          </section>

          <section>
            <h2 class="text-lg font-semibold mb-4">Delivery</h2>

            <select class="w-full border border-gray-200 px-4 py-3 rounded mb-4">
              <option>Nigeria</option>
            </select>

            <input
              v-model="checkout.form.firstName"
              placeholder="First name (optional)"
              class="border px-4 py-3 border-gray-200 rounded"
            />

            <input
              v-model="checkout.form.lastName"
              placeholder="Last name"
              class="border px-4 py-3 border-gray-200 rounded"
            />

            <input
              v-model="checkout.form.address"
              placeholder="Address"
              class="border border-gray-200 px-4 py-3 rounded w-full mb-4"
            />

            <div class="grid grid-cols-3 gap-4 mb-4">
              <input
                v-model="checkout.form.city"
                placeholder="City"
                class="border px-4 py-3 border-gray-200 rounded"
              />

              <select
                v-model="checkout.form.state"
                class="border border-gray-200 px-4 py-3 rounded"
              >
                <option value="Rivers">Rivers</option>
                <option value="Lagos">Lagos</option>
              </select>

              <input
                v-model="checkout.form.postalCode"
                placeholder="Postal code (optional)"
                class="border px-4 py-3 border-gray-200 rounded"
              />
            </div>

            <label class="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" />
              Save this information for next time
            </label>
          </section>

          <section>
            <h2 class="text-lg font-semibold mb-4">Shipping method</h2>

            <div class="border rounded border-gray-200 px-4 py-4 flex justify-between">
              <span>International Shipping</span>
              <span>$20.00</span>
            </div>
          </section>

          <section>
            <h2 class="text-lg font-semibold mb-1">Payment</h2>
            <p class="text-sm text-gray-500 mb-4">All transactions are secure and encrypted.</p>

            <div class="border rounded-lg p-4 border-gray-200 bg-gray-50 space-y-4">
              <label class="flex items-center gap-2 font-medium">
                <input type="radio" value="card" v-model="checkout.form.paymentMethod" />
                Credit card
              </label>

              <input placeholder="Card number" class="border px-4 py-3 rounded w-full" />

              <div class="grid grid-cols-2 gap-4">
                <input placeholder="Expiration date (MM / YY)" class="border px-4 py-3 rounded" />
                <input placeholder="Security code" class="border px-4 py-3 rounded" />
              </div>

              <input placeholder="Name on card" class="border px-4 py-3 rounded w-full" />

              <label class="flex items-center gap-2 text-sm">
                <input type="checkbox" v-model="checkout.form.useShippingAsBilling" />
                Use shipping address as billing address
              </label>

              <div v-if="!checkout.form.useShippingAsBilling" class="mt-4">
                <input
                  v-model="checkout.form.billingAddress"
                  placeholder="Billing address"
                  class="border border-gray-200 px-4 py-3 rounded w-full"
                />
              </div>

              <label class="flex items-center gap-2 text-sm mt-4">
                <input type="radio" value="cod" v-model="checkout.form.paymentMethod" />
                Cash on Delivery (COD)
              </label>
            </div>

            <button
              class="mt-6 w-full bg-black text-white py-4 rounded text-lg disabled:opacity-60"
              :disabled="!cart.items.length || checkout.loading"
              @click="payNow"
            >
              {{ checkout.loading ? 'Processing...' : 'Pay now' }}
            </button>

            <p v-if="checkout.error" class="text-sm text-red-600 mt-3">
              {{ checkout.error }}
            </p>
          </section>
        </div>

        <div class="lg:sticky lg:top-20 h-fit">
          <div class="bg-gray-50 p-6 rounded space-y-6">
            <div v-for="item in cart.items" :key="item.id" class="flex gap-4 items-start">
              <div class="relative">
                <img
                  :src="item.image"
                  class="w-16 h-16 rounded border border-gray-200 bg-white object-contain"
                />
                <span
                  class="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center"
                >
                  {{ cartBadgeCount }}
                </span>
              </div>

              <div class="flex-1">
                <p class="text-sm leading-snug">
                  {{ item.title }}
                </p>
              </div>

              <p class="text-sm font-medium">
                ${{ (Number(item.price || 0) * Number(item.qty || 1)).toFixed(2) }}
              </p>
            </div>

            <hr />

            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span>Subtotal · {{ cart.items.length }} items</span>
                <span>${{ subtotal.toFixed(2) }}</span>
              </div>

              <div class="flex justify-between">
                <span>Shipping</span>
                <span>$20.00</span>
              </div>
            </div>

            <hr />

            <div class="flex justify-between items-center text-lg font-semibold">
              <span>Total</span>
              <span>USD ${{ total.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
