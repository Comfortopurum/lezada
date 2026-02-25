<script setup>
import ShopSidebar from '@/components/shop/ShopSidebar.vue'
import ShopToolbar from '@/components/shop/ShopToolbar.vue'
import ProductGrid from '@/components/shop/ProductGrid.vue'

import { useProductsStore } from '@/stores/products'
import { onMounted, computed } from 'vue'

const store = useProductsStore()

onMounted(() => {
  store.fetchProducts(1)
})

const pages = computed(() => {
  const last = store.pagination.last_page || 1
  const current = store.pagination.current_page || 1

  if (last <= 7) return Array.from({ length: last }, (_, i) => i + 1)

  const set = new Set([1, 2, current - 1, current, current + 1, last - 1, last])
  const arr = [...set].filter((n) => n >= 1 && n <= last).sort((a, b) => a - b)

  const out = []
  for (let i = 0; i < arr.length; i++) {
    out.push(arr[i])
    if (i < arr.length - 1 && arr[i + 1] - arr[i] > 1) out.push('...')
  }
  return out
})

const goTo = (p) => {
  if (p === '...') return
  store.goToPage(p)
}
</script>

<template>
  <section class="max-w-7xl mx-auto px-6 py-16">
    <ShopToolbar />

    <div class="grid grid-cols-12 gap-10 mt-10">
      <aside class="col-span-3">
        <ShopSidebar />
      </aside>

      <div class="col-span-9">
        <ProductGrid />

        <div class="flex justify-start lg:pl-20 items-center gap-2 mt-16 text-sm text-gray-500">
          <button
            class="px-3 py-2 border rounded disabled:opacity-50"
            :disabled="store.pagination.current_page === 1"
            @click="store.prevPage"
          >
            Prev
          </button>

          <button
            v-for="(p, idx) in pages"
            :key="idx"
            class="px-3 py-2 disabled:opacity-60"
            :disabled="p === '...'"
            :class="p === store.pagination.current_page ? 'underline font-semibold text-black' : ''"
            @click="goTo(p)"
          >
            {{ p }}
          </button>

          <button
            class="px-3 py-2 border rounded disabled:opacity-50"
            :disabled="store.pagination.current_page === store.pagination.last_page"
            @click="store.nextPage"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
