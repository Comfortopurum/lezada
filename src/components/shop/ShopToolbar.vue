<script setup>
import { Grid2X2, Grid3x2, Grid3x3 } from 'lucide-vue-next'
import { computed } from 'vue'
import { useProductsStore } from '@/stores/products'

const store = useProductsStore()

const total = computed(() => store.pagination.total ?? 0)
const perPage = computed(() => store.pagination.per_page ?? 20)
const currentPage = computed(() => store.pagination.current_page ?? 1)

const start = computed(() => (total.value === 0 ? 0 : (currentPage.value - 1) * perPage.value + 1))
const end = computed(() =>
  total.value === 0 ? 0 : Math.min(currentPage.value * perPage.value, total.value),
)

const onChangePerPage = async (e) => {
  const value = Number(e.target.value)
  if (!Number.isFinite(value) || value <= 0) return
  store.pagination.per_page = value
  await store.fetchProducts(1)
}

const onChangeSort = (e) => {
  store.setSortBy(e.target.value)
}
</script>

<template>
  <div class="flex items-center justify-between border-b pb-6 text-sm text-gray-500">
    <div class="flex gap-4">
      <!-- 4 cols -->
      <button
        type="button"
        class="transition"
        :class="store.gridCols === 4 ? 'text-black' : 'text-gray-400 hover:text-gray-600'"
        @click="store.setGridCols(4)"
      >
        <Grid3x3 class="w-5 h-5" />
      </button>

      <!-- 3 cols -->
      <button
        type="button"
        class="transition"
        :class="store.gridCols === 3 ? 'text-black' : 'text-gray-400 hover:text-gray-600'"
        @click="store.setGridCols(3)"
      >
        <Grid3x2 class="w-5 h-5" />
      </button>

      <!-- 2 cols -->
      <button
        type="button"
        class="transition"
        :class="store.gridCols === 2 ? 'text-black' : 'text-gray-400 hover:text-gray-600'"
        @click="store.setGridCols(2)"
      >
        <Grid2X2 class="w-5 h-5" />
      </button>
    </div>

    <div class="flex items-center gap-6">
      <span
        >Showing {{ start }} – {{ end }} of {{ total }} result<span v-if="total !== 1"
          >s</span
        ></span
      >

      <div>
        Show
        <select
          class="border px-2 py-1 mx-1"
          :value="perPage"
          @change="onChangePerPage"
          :disabled="store.loading"
        >
          <option :value="12">12</option>
          <option :value="20">20</option>
          <option :value="24">24</option>
          <option :value="48">48</option>
        </select>
        per page
      </div>

      <div>
        Sort by:
        <select class="border px-2 py-1 ml-1" :value="store.sortBy" @change="onChangeSort">
          <option value="az">Alphabetically, A–Z</option>

          <option value="price_asc">Price, low to high</option>
        </select>
      </div>
    </div>
  </div>
</template>
