<script setup>
import { X } from 'lucide-vue-next'
import { ref } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useQuickViewStore } from '@/stores/quickViewStore'

const quickView = useQuickViewStore()

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['close'])

const qty = ref(1)
const cart = useCartStore()

const addToCart = () => {
  cart.addToCart({ ...props.product, qty: qty.value })
  emit('close')
}
</script>

<template>
  <div class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
    <div class="bg-white w-full max-w-4xl p-10 relative">
      <button @click="quickView.close">
        <X />
      </button>

      <div class="grid md:grid-cols-2 gap-10">
        <img :src="product.image" class="w-full h-105 object-contain bg-gray-50" />

        <div>
          <h2 class="text-2xl mb-2">{{ product.title }}</h2>
          <p class="text-xl font-semibold mb-4">${{ product.price }}</p>

          <p class="text-gray-600 mb-6 line-clamp-4">
            {{ product.description }}
          </p>

          <div class="flex items-center gap-4 mb-6">
            <button @click="qty > 1 && qty--">−</button>
            <span>{{ qty }}</span>
            <button @click="qty++">+</button>
          </div>

          <button class="bg-black text-white px-8 py-3" @click="addToCart">ADD TO CART</button>
        </div>
      </div>

      <div class="border-t mt-10 pt-6 text-center">
        <p class="mb-4 text-gray-500">SOCIAL SHARE</p>
        <div class="flex justify-center gap-4">
          <div class="w-10 h-10 bg-blue-600 rounded-full"></div>
          <div class="w-10 h-10 bg-sky-400 rounded-full"></div>
          <div class="w-10 h-10 bg-red-500 rounded-full"></div>
        </div>
      </div>
    </div>
  </div>
</template>
