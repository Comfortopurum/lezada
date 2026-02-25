<script setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useBlogStore } from '@/stores/blog'

const blog = useBlogStore()

const search = ref('')

const filteredPosts = computed(() => {
  if (!search.value) return blog.posts

  return blog.posts.filter((p) => p.title.toLowerCase().includes(search.value.toLowerCase()))
})

const archive = computed(() => {
  const groups = {}

  blog.posts.forEach((p) => {
    const d = new Date(p.date)
    const key = d.toLocaleString('default', {
      month: 'long',
      year: 'numeric',
    })

    if (!groups[key]) groups[key] = []
    groups[key].push(p)
  })

  return groups
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-6 py-16">
    <p class="text-sm text-gray-500 mb-12">Home / News</p>

    <div class="grid md:grid-cols-4 gap-12">
      <aside class="space-y-10">
        <div>
          <h3 class="text-lg mb-4">Archive</h3>

          <div v-for="(posts, label) in archive" :key="label" class="mb-4">
            <p class="font-medium">{{ label }}</p>
            <p v-for="p in posts" :key="p.id" class="text-sm text-gray-600">
              {{ p.title }}
            </p>
          </div>
        </div>

        <input
          v-model="search"
          placeholder="Search our store"
          class="w-full border-b pb-2 outline-none"
        />

        <div>
          <h3 class="text-lg mb-4">Recent Post</h3>

          <RouterLink
            v-for="p in blog.recentPosts"
            :key="p.id"
            :to="`/blog/${p.id}`"
            class="flex gap-3 mb-4 hover:opacity-70"
          >
            <div class="grid grid-cols-1">
              <img :src="p.image" class="w-full object-cover row-span-1 bg-gray-100" />
              <div class="">
                <p class="text-sm">{{ p.title }}</p>
                <p class="text-xs text-gray-500">{{ p.date }}</p>
              </div>
            </div>
          </RouterLink>
        </div>

        <div>
          <h3 class="text-lg mb-4">Tags</h3>
          <div class="flex flex-wrap gap-2 text-sm text-gray-600">
            <span v-for="t in blog.allTags" :key="t"> {{ t }} / </span>
          </div>
        </div>
      </aside>

      <main class="md:col-span-3 space-y-16">
        <article v-for="post in filteredPosts" :key="post.id" class="space-y-6">
          <RouterLink :to="`/blog/${post.id}`">
            <img :src="post.image" class="w-full h-105 object-cover hover:opacity-90" />
          </RouterLink>

          <div class="text-sm text-gray-500 flex gap-6">
            <span>By: {{ post.author }}</span>
            <span>{{ post.date }}</span>
            <span>{{ post.comments }} Comments</span>
          </div>

          <RouterLink :to="`/blog/${post.id}`">
            <h2 class="text-3xl hover:underline">
              {{ post.title }}
            </h2>
          </RouterLink>

          <p class="text-gray-600">
            {{ post.excerpt }}
          </p>

          <RouterLink :to="`/blog/${post.id}`" class="text-sm tracking-widest underline">
            READ MORE
          </RouterLink>
        </article>
      </main>
    </div>
  </div>
</template>
