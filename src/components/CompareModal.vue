<script setup>
import { useCompareStore } from '@/stores/compare'
import { X } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

const compare = useCompareStore()
</script>
<template>
  <div
    v-if="compare.isOpen"
    class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
  >
    <div class="bg-white w-[90%] max-w-6xl p-8 relative overflow-auto max-h-[90vh]">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl tracking-wide">COMPARE PRODUCT</h2>
        <button class="" @click="compare.close">
          <X />
        </button>
      </div>

      <table class="w-full border-collapse text-sm">
        <tbody>
          <tr>
            <td class="border border-gray-300 p-4 font-medium">Action</td>
            <td
              v-for="product in compare.products"
              :key="product.id"
              class="border border-gray-300 p-4 text-center"
            >
              <button @click="compare.removeProduct(product.id)">✕</button>
            </td>
          </tr>

          <tr>
            <td class="border border-gray-300 p-4 font-medium">Product Name</td>
            <td
              v-for="product in compare.products"
              :key="product.id"
              class="border border-gray-300 p-4 text-center"
            >
              {{ product.title }}
            </td>
          </tr>

          <tr>
            <td class="border border-gray-300 p-4 font-medium">Product Image</td>
            <td
              v-for="product in compare.products"
              :key="product.id"
              class="border border-gray-300 p-4 text-center"
            >
              <img :src="product.image" class="w-32 h-32 object-contain mx-auto mb-3" />
              <p class="text-red-500 font-semibold">${{ product.price }}</p>

              <RouterLink
                :to="`/product/${product.id}`"
                class="text-xs uppercase text-gray-500 hover:underline"
              >
                View Product
              </RouterLink>
            </td>
          </tr>

          <tr class="bg-gray-50">
            <td class="border border-gray-300 p-4 font-medium">Product Description</td>
            <td
              v-for="product in compare.products"
              :key="product.id"
              class="border border-gray-300 p-4 text-gray-600"
            >
              {{ product.description }}
            </td>
          </tr>

          <tr>
            <td class="border border-gray-300 p-4 font-medium">Availability</td>
            <td
              v-for="product in compare.products"
              :key="product.id"
              class="border border-gray-300 p-4 text-center"
            >
              In Stock
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
