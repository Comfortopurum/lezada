<script setup>
import ProductCard from '@/components/ProductCard.vue'
import { useWishlistStore } from '@/stores/wishlist'

const wishlist = useWishlistStore()
</script>

<template>
  <div class="max-w-7xl mx-auto p-6 mt-20">
    <div class="">
      <div v-if="wishlist.items" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-20">
        <ProductCard v-for="item in wishlist.items" :key="item.id" :product="item" />
      </div>

      <p v-else class="text-gray-500 mb-20">Your wishlist is empty.</p>
    </div>
  </div>
</template>
