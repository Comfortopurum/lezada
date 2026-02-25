<script setup>
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
</script>

<template>
  <div>
    <Navbar />

    <main>
      <RouterView />
    </main>

    <Footer />
  </div>
</template>
