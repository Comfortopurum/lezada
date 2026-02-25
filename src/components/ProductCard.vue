<script setup>
import { Heart, Search, Shuffle, X } from 'lucide-vue-next'
import { useWishlistStore } from '@/stores/wishlist'
import { useCartStore } from '@/stores/cart'
import { computed, inject } from 'vue'
import { RouterLink } from 'vue-router'
import { useCompareStore } from '@/stores/compare'
import { useProductsStore } from '@/stores/products'
import { useQuickViewStore } from '@/stores/quickViewStore'
const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
})

const wishlist = useWishlistStore()
const cart = useCartStore()
const openCartModal = inject('openCartModal', null)

const isWished = computed(() => wishlist.isInWishlist(props.product.id))

const toggleWishlist = () => {
  wishlist.toggle(props.product)
}

const addToCart = async () => {
  await cart.addToCart(props.product.id, 1)

  if (openCartModal) {
    openCartModal()
  } else {
    console.warn('openCartModal not provided')
  }
}

const compare = useCompareStore()
const productsStore = useProductsStore()

const compareProduct = () => {
  if (!productsStore.products.length) return
  compare.openCompare(props.product, productsStore.products)
}

const quickView = useQuickViewStore()

const openQuickView = () => {
  quickView.show(props.product)
}

console.log('openCartModal:', openCartModal)
</script>

<template>
  <div class="group">
    <div class="relative bg-[#f6f6f6] p-10 overflow-hidden">
      <div class="absolute top-4 left-4 text-white space-y-2 z-10">
        <div class="bg-[#98d8ca] text-xs p-4 py-6 rounded-full">SALE</div>
        <div class="bg-[#98d8ca] text-xs p-4 py-6 rounded-full">-20%</div>
      </div>

      <div
        class="absolute top-4 right-4 space-y-3 opacity-0 group-hover:opacity-100 transition z-10"
      >
        <div class="relative bg-white p-2 cursor-pointer group" @click="toggleWishlist">
          <X v-if="isWished" class="w-5 h-5 text-gray-700" />
          <Heart v-else class="w-5 h-5 text-gray-700" />

          <span
            class="absolute right-10 top-1/2 -translate-y-1/2 whitespace-nowrap bg-black text-white text-xs px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition"
          >
            {{ isWished ? 'Remove from wishlist' : 'Add to wishlist' }}
          </span>
        </div>

        <div class="bg-white p-2 cursor-pointer" @click="compareProduct">
          <Shuffle class="w-5 h-5" />
        </div>

        <div class="bg-white p-2 cursor-pointer" @click="openQuickView">
          <Search class="w-5 h-5" />
        </div>
      </div>

      <RouterLink :to="`/product/${product.id}`">
        <img
          :src="product.image"
          :alt="product.name ?? product.title"
          {{
          product.name
          ??
          product.title
          }}
          class="mx-auto h-48 w-full object-contain transition-transform group-hover:scale-105 cursor-pointer"
        />
      </RouterLink>

      <div
        class="absolute bottom-0 inset-x-0 mx-auto w-3/5 mb-4 rounded-lg bg-white py-4 px-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
        id="box"
      >
        <div class="flex justify-center gap-4 mb-3 text-xs text-gray-500">
          <span>S</span>
          <span>M</span>
          <span>L</span>
          <span>XL</span>
        </div>

        <div class="flex justify-center gap-2">
          <div
            v-for="n in 4"
            :key="n"
            class="w-10 h-10 bg-gray-100 flex items-center justify-center rounded-full"
          >
            <img :src="product.image" class="w-6 h-6 object-contain" />
          </div>
        </div>
      </div>
    </div>

    <div class="mt-4 text-lg text-start">
      <p
        class="mb-1 text-red-500 opacity-0 group-hover:opacity-100 cursor-pointer"
        @click="addToCart"
      >
        + Add to Cart
      </p>

      <p class="mb-1 line-clamp-1 group-hover:hidden transition">
        {{ product.name ?? product.title }}
      </p>

      <div class="flex gap-2 items-center">
        <span class="font-semibold">${{ product.price }}</span>
        <span class="line-through text-gray-400">$130.00</span>
      </div>
    </div>
  </div>
</template>
