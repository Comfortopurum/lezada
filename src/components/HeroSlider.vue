<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const slides = [
  {
    tag: 'ACCESSORIES',
    title: 'Bottle Grinder,\nSmall, 2-Piece',
    image:
      'https://lezada-demo.myshopify.com/cdn/shop/files/banner-carousel-1_1170x.jpg?v=1613746686',
  },
  {
    tag: 'NEW ARRIVALS',
    title: 'Modern Chair,\nWood Edition',
    image:
      'https://lezada-demo.myshopify.com/cdn/shop/files/banner-carousel-2_1170x.jpg?v=1613746686',
  },
  {
    tag: 'SALE UP TO 40%',
    title: 'Minimal Lamp,\nNordic Style',
    image:
      'https://lezada-demo.myshopify.com/cdn/shop/files/banner-carousel-3_1170x.jpg?v=1613746686',
  },
]

const activeIndex = ref(0)
let interval = null

const nextSlide = () => {
  activeIndex.value = (activeIndex.value + 1) % slides.length
}

onMounted(() => {
  interval = setInterval(nextSlide, 5000)
})

onUnmounted(() => {
  clearInterval(interval)
})
</script>

<template>
  <section id="bg" class="relative p-32 h-150 overflow-hidden group">
    <div
      v-for="(slide, index) in slides"
      :key="index"
      class="absolute inset-0 transition-opacity duration-1000 max-w-7xl mx-auto px-6"
      :class="activeIndex === index ? 'opacity-100 z-10' : 'opacity-0 z-0'"
    >
      <img :src="slide.image" class="w-full h-full object-cover" alt="" />

      <div class="absolute inset-0 flex items-center">
        <div class="w-fullmax-w-7xl px-6">
          <div class="max-w-md px-6 text-gray-900">
            <p class="text-xs tracking-[0.3em] mb-4">
              {{ slide.tag }}
            </p>

            <h1 class="text-4xl md:text-5xl font-light leading-snug mb-8 whitespace-pre-line">
              {{ slide.title }}
            </h1>
            <RouterLink to="shop">
              <button
                class="border border-black px-10 py-3 cursor-pointer text-white bg-black text-sm tracking-wide hover:bg-transparent hover:text-black transition"
              >
                SHOP NOW
              </button>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>

    <button
      @click="prevSlide"
      class="absolute opacity-0 group-hover:opacity-100 cursor-pointer left-6 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center bg-white/70 hover:bg-white transition"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-20 h-20"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>

    <button
      @click="nextSlide"
      class="absolute opacity-0 group-hover:opacity-100 cursor-pointer right-6 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center bg-white/70 hover:bg-white transition"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-20 h-20"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>

    <div class="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
      <button
        v-for="(_, i) in slides"
        :key="i"
        @click="activeIndex = i"
        class="w-3 h-3 rounded-full transition"
        :class="activeIndex === i ? 'bg-black' : 'bg-gray-300'"
      />
    </div>
  </section>
</template>
