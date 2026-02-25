<script setup>
import { useCartStore } from '@/stores/cart'
import { useRouter } from 'vue-router'

const cart = useCartStore()
const router = useRouter()

const emit = defineEmits(['close'])
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div class="bg-white w-175 p-10 relative">
      <button class="absolute top-4 right-4 text-xl" @click="emit('close')">✕</button>

      <div class="grid grid-cols-2 gap-10">
        <div>
          <p class="flex items-center gap-2 text-green-600 mb-4">
            Product Successfully Added To Your Shopping Cart
          </p>

          <img :src="cart.items.at(-1)?.image" class="w-40 mb-4" />

          <p class="font-medium">
            {{ cart.items.at(-1)?.title }}
          </p>
        </div>

        <div>
          <p class="text-sm text-gray-500 mb-2">
            THERE ARE {{ cart.totalItems }} ITEMS IN YOUR CART.
          </p>

          <p class="text-xl mb-6">
            Total Price:
            <strong>${{ cart.totalPrice.toFixed(2) }} USD</strong>
          </p>

          <div class="space-y-3">
            <button class="border w-full py-3" @click="emit('close')">CONTINUE SHOPPING</button>

            <button class="border w-full py-3" @click="router.push('/cart')">VIEW CART</button>

            <button class="bg-red-500 text-white w-full py-3" @click="router.push('/checkout')">
              CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
