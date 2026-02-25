<script setup>
import { Twitter, Instagram, Facebook, Youtube, Linkedin } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
</script>

<template>
  <footer class="border-t py-20 text-sm text-gray-500">
    <div class="max-w-7xl mx-auto px-6">
      <div class="flex justify-between mb-10">
        <div class="flex gap-8">
          <span>Search</span>
          <RouterLink to="/shop">About us</RouterLink>
          <RouterLink to="/catalog">Contact</RouterLink>
          <RouterLink to="/shop">Policy</RouterLink>
          <RouterLink to="/shop">Faqs</RouterLink>
        </div>

        <div class="flex gap-4 text-gray-500">
          <twitter class="w-5 h-5 hover:text-black cursor-pointer" />
          <Instagram class="w-5 h-5 hover:text-black cursor-pointer" />
          <Facebook class="w-5 h-5 hover:text-black cursor-pointer" />
          <Youtube class="w-5 h-5 hover:text-black cursor-pointer" />
          <Linkedin class="w-5 h-5 hover:text-black cursor-pointer" />
        </div>
      </div>

      <div class="flex justify-between items-center">
        <p>© 2018 lezada. All Rights Reserved | (+00) 123 567990 | contact@lezada.com</p>

        <div class="flex gap-4">
          <span>VISA</span>
          <span>MC</span>
          <span>AMEX</span>
          <span>PAYPAL</span>
        </div>
      </div>
    </div>
  </footer>
</template>
