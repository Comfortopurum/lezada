<script setup>
import { ref } from 'vue'

const open = ref({
  availability: true,
  price: true,
  color: true,
})
</script>

<template>
  <div class="space-y-10 text-sm">
    <div>
      <h3 class="font-medium mb-4">Custom Menu</h3>
      <ul class="space-y-2 text-gray-600">
        <li>Home</li>
        <li>Shop</li>
        <li>Catalog SALE</li>
        <li>Blog</li>
        <li>Pages</li>
      </ul>
    </div>

    <div>
      <h3 class="font-medium mb-4">Availability</h3>
      <label class="flex items-center gap-2 mb-2"> <input type="checkbox" /> In stock (48) </label>
      <label class="flex items-center gap-2"> <input type="checkbox" /> Out of stock (25) </label>
    </div>

    <div>
      <h3 class="font-medium mb-4">Price</h3>
      <input class="border p-2 w-full mb-2" placeholder="$60" />
      <input class="border p-2 w-full mb-4" placeholder="$80" />
      <button class="bg-black text-white px-6 py-2 text-sm">Filter</button>
    </div>

    <div>
      <h3 class="font-medium mb-4">Color</h3>
      <div class="space-y-2">
        <label class="flex items-center gap-2" v-for="c in 6" :key="c">
          <input type="checkbox" /> Color {{ c }}
        </label>
      </div>
    </div>
  </div>
</template>
