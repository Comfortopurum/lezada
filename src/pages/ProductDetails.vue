<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Heart, X, Facebook, Twitter, Truck, MailCheck } from 'lucide-vue-next'

import { useProductsStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'

const route = useRoute()
const productsStore = useProductsStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()

const product = ref(null)
const quantity = ref(1)
const activeTab = ref('description')

onMounted(async () => {
  if (!productsStore.products.length) {
    await productsStore.fetchProducts()
  }

  product.value = productsStore.products.find((p) => p.id === Number(route.params.id))

  saveRecentlyViewed()
})

const isWished = computed(() =>
  product.value ? wishlistStore.isInWishlist(product.value.id) : false,
)

const totalPrice = computed(() =>
  product.value ? (product.value.price * quantity.value).toFixed(2) : '0.00',
)

const relatedProducts = computed(() =>
  productsStore.products
    .filter((p) => p.category === product.value?.category && p.id !== product.value?.id)
    .slice(0, 4),
)

const addToCart = () => {
  cartStore.addToCart(product.value, quantity.value)
}

const toggleWishlist = () => {
  wishlistStore.toggle(product.value)
}

const saveRecentlyViewed = () => {
  const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]')
  const filtered = viewed.filter((p) => p.id !== product.value.id)
  localStorage.setItem('recentlyViewed', JSON.stringify([product.value, ...filtered].slice(0, 4)))
}

const recentlyViewed = computed(() => JSON.parse(localStorage.getItem('recentlyViewed') || '[]'))
</script>

<template>
  <div v-if="product" class="max-w-7xl mx-auto px-6 py-16">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-16">
      <div class="bg-gray-100 p-10">
        <img :src="product.image" class="mx-auto h-105 object-contain" />
      </div>

      <div>
        <h1 class="text-3xl font-light mb-2">{{ product.title }}</h1>
        <p class="text-sm text-red-500 mb-4">Availability: In Stock</p>

        <p class="text-2xl mb-6">${{ product.price }}</p>

        <div class="flex gap-6 text-sm mb-6">
          <span><Truck class="w-5 h-5" /> Shipping</span>
          <span><MailCheck class="w-5 h-5" /> Ask About This Product</span>
        </div>

        <div class="flex items-center gap-6 mb-6">
          <span>Quantity:</span>
          <div class="flex items-center border px-4 py-2">
            <button @click="quantity > 1 && quantity--">-</button>
            <span class="mx-6">{{ quantity }}</span>
            <button @click="quantity++">+</button>
          </div>
        </div>

        <div class="flex items-center gap-4 mb-4">
          <button @click="addToCart" class="bg-gray-800 text-white px-10 py-3 text-sm">
            ADD TO CART
          </button>

          <button
            class="border p-3"
            @click="toggleWishlist"
            :title="isWished ? 'Remove wishlist' : 'Add wishlist'"
          >
            <X v-if="isWished" />
            <Heart v-else />
          </button>
        </div>

        <label class="flex items-center gap-2 text-sm mb-4">
          <input type="checkbox" />
          I agree with the terms and conditions
        </label>

        <button class="w-full bg-[#f6e6a7] py-3 text-sm mb-6">BUY IT NOW</button>

        <div class="text-sm text-gray-500 space-y-2">
          <p>SKU: {{ product.id }}</p>
          <p>Vendor: Vendor {{ product.id }}</p>
          <p>Type: {{ product.category }}</p>
        </div>

        <div class="flex gap-4 mt-4">
          <Facebook />
          <Twitter />
        </div>
      </div>
    </div>

    <div class="mt-20">
      <div class="flex justify-center gap-10 text-xl mb-10">
        <button @click="activeTab = 'description'">Description</button>
        <button @click="activeTab = 'review'">Review</button>
        <button @click="activeTab = 'custom'">Custom Tab</button>
      </div>

      <p v-if="activeTab === 'description'" class="text-gray-600 leading-8">
        {{ product.description }}
      </p>
    </div>

    <h2 class="text-3xl text-center mt-24 mb-12">Related Product</h2>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
      <RouterLink v-for="p in relatedProducts" :key="p.id" :to="`/product/${p.id}`">
        <img :src="p.image" class="h-48 mx-auto object-contain" />
        <p class="mt-4">{{ p.title }}</p>
        <p>${{ p.price }}</p>
      </RouterLink>
    </div>

    <h2 class="text-3xl text-center mt-24 mb-12">Recently Viewed Products</h2>
    <div class="grid grid-cols-2 md:grid-cols-3 gap-8">
      <RouterLink v-for="p in recentlyViewed" :key="p.id" :to="`/product/${p.id}`">
        <img :src="p.image" class="h-48 mx-auto object-contain" />
        <p class="mt-4">{{ p.title }}</p>
        <p>${{ p.price }}</p>
      </RouterLink>
    </div>
  </div>
</template>
