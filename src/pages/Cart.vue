<script setup>
import { useCartStore } from '@/stores/cart'
import { useProductsStore } from '@/stores/products'
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()

onMounted(async () => {
  if (auth.isAuthenticated) {
    await cart.fetchCart()
  }
})

const cart = useCartStore()
const productsStore = useProductsStore()
const router = useRouter()

onMounted(() => {
  if (!productsStore.products.length) {
    productsStore.fetchProducts()
  }
})

const suggestedProducts = computed(() =>
  productsStore.products.filter((p) => !cart.items.some((c) => c.id === p.id)).slice(0, 4),
)
</script>

<template>
  <div class="max-w-7xl mx-auto py-26 px-6">
    <div class="overflow-x-auto border border-gray-300 mb-10">
      <table class="w-full text-sm">
        <thead class="border border-gray-300">
          <tr class="text-center">
            <th class="p-4 t w-1/12"></th>
            <th class="p-4 pr-16">PRODUCT</th>
            <th class="p-4 border border-gray-300">PRICE</th>
            <th class="p-4 border border-gray-300">QUANTITY</th>
            <th class="p-4 border border-gray-300">TOTAL</th>
            <th class="p-4"></th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in cart.items" :key="item.cart_id" class="border-gray-300 align-middle">
            <td class="p-4 flex items-center border-b border-gray-300 gap-4">
              <img :src="item.image" class="w-20 h-20 object-contain bg-gray-100" />
            </td>

            <td class="border border-gray-300">
              <span>{{ item.name }}</span>
            </td>

            <td class="p-4 border border-gray-300">${{ Number(item.price).toFixed(2) }}</td>

            <td class="p-4 border border-gray-300">
              <div class="flex items-center justify-center gap-4">
                <div class="border-b space-x-4 py-4 px-2">
                  <button @click="cart.updateCart(item.cart_id, 'decrement')">−</button>
                  <span>{{ item.quantity }}</span>
                  <button @click="cart.updateCart(item.cart_id, 'increment')">+</button>
                </div>
              </div>
            </td>

            <td class="p-4 border border-gray-300">
              ${{ (Number(item.price) * Number(item.quantity)).toFixed(2) }}
            </td>

            <td class="p-4">
              <button
                class="border px-3 py-1 text-gray-500"
                @click="cart.removeFromCart(item.cart_id)"
              >
                ✕
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex flex-wrap gap-4 mb-20 justify-end">
      <button class="bg-gray-800 text-white px-8 py-3">UPDATE CART</button>

      <button class="bg-gray-800 text-white px-8 py-3" @click="router.push('/shop')">
        CONTINUE SHOPPING
      </button>

      <button
        class="bg-gray-800 text-white px-8 py-3"
        @click="Promise.all(cart.items.map((i) => cart.removeFromCart(i.id)))"
      >
        CLEAR CART
      </button>
    </div>

    <div class="grid md:grid-cols-2 gap-16 mb-32">
      <div>
        <h3 class="text-lg mb-6">Pick a delivery date and Time</h3>

        <input type="date" class="w-full border px-4 py-3 mb-4" />
        <input placeholder="Write delivery time" class="w-full border px-4 py-3 mb-4" />

        <p class="text-sm text-gray-500 mb-10">
          Delivery Time takes place between 12PM - 4PM MON-FRI AND 8AM-11AM SAT.
        </p>

        <h3 class="text-lg mb-4">Get shipping estimates</h3>

        <input class="w-full border px-4 py-3 mb-4" placeholder="---" />
        <input class="w-full border px-4 py-3 mb-6" placeholder="Zip/Postal Code" />

        <button class="bg-gray-800 text-white px-8 py-3">CALCULATE SHIPPING</button>
      </div>

      <div class="bg-[#f6f6f6] p-10">
        <h2 class="text-2xl mb-8">Cart Totals</h2>

        <div class="flex justify-between border-b py-4">
          <span>SUBTOTAL</span>
          <span>${{ cart.totalPrice.toFixed(2) }}</span>
        </div>

        <div class="flex justify-between py-4">
          <span>TOTAL</span>
          <span>${{ cart.totalPrice.toFixed(2) }}</span>
        </div>

        <label class="flex items-center gap-2 text-sm my-6">
          <input type="checkbox" />
          I agree with the terms and conditions
        </label>

        <RouterLink to="/checkout" class="block bg-red-600 text-white text-center py-4 mt-4">
          PROCEED TO CHECKOUT
        </RouterLink>
      </div>
    </div>

    <div class="text-center">
      <h2 class="text-3xl mb-16">You can also buy</h2>

      <div class="grid md:grid-cols-4 gap-10">
        <div v-for="product in suggestedProducts" :key="product.id">
          <img :src="product.image" class="bg-gray-100 w-full h-60 object-contain" />
          <p class="mt-4">{{ product.title ?? product.name }}</p>
          <p class="text-gray-600">${{ product.price }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
