<script setup>
import { computed, ref } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import test2 from '../assets/img/test2.png'
import test3 from '../assets/img/test3.png'
import test5 from '../assets/img/test5.png'
import { useBlogStore } from '@/stores/blog'

const route = useRoute()
const blogStore = useBlogStore()

const id = computed(() => route.params.id || '')

const post = computed(() => {
  const id = Number(route.params.id)
  return blogStore.posts.find((p) => p.id === id) || null
})
const recentPosts = computed(() => blogStore.recentPosts)

const archive = [
  { month: 'March 2019', posts: ['Shirt pent Color Picking Guide'] },
  {
    month: 'January 2019',
    posts: ['T-Shirts as Minimalist Style', 'Perfect Perfume & Cologne', 'Tips to Lasting Perfume'],
  },
]

const name = ref('')
const email = ref('')
const message = ref('')

const submitComment = () => {
  console.log({ name: name.value, email: email.value, message: message.value })
  alert('Comment submitted (demo)')
}
console.log('id param:', route.params.id)
console.log('post:', post.value)
</script>

<template>
  <div class="max-w-7xl mx-auto px-6 py-16">
    <div class="grid md:grid-cols-4 gap-12">
      <aside class="space-y-10">
        <div>
          <input placeholder="Search our store" class="w-full border-b pb-2 outline-none" />
        </div>

        <div>
          <h3 class="text-lg mb-4">Recent Post</h3>
          <div class="space-y-4">
            <RouterLink
              v-for="r in recentPosts"
              :key="r.id"
              :to="`/blog/${r.id}`"
              class="flex gap-3 items-center hover:opacity-70"
            >
              <img :src="r.image" class="w-16 h-16 object-cover bg-gray-100" />
              <div>
                <p class="text-sm font-medium">{{ r.title }}</p>
                <p class="text-xs text-gray-500">{{ r.date }}</p>
              </div>
            </RouterLink>
          </div>
        </div>

        <div>
          <h3 class="text-lg mb-4">Archive</h3>
          <div v-for="a in archive" :key="a.month" class="mb-4">
            <p class="font-medium">{{ a.month }}</p>
            <p v-for="p in a.posts" :key="p" class="text-sm text-gray-600">
              {{ p }}
            </p>
          </div>
        </div>

        <div>
          <h3 class="text-lg mb-4">Tags</h3>
          <div class="flex flex-wrap gap-2 text-sm text-gray-600">
            <span v-for="t in post?.tags" :key="t"> {{ t }} / </span>
          </div>
        </div>
      </aside>

      <main class="md:col-span-3">
        <div v-if="post">
          <img
            v-if="post?.image"
            :key="post.id"
            :src="post.image"
            class="w-full h-125 object-cover mb-8"
          />

          <div class="text-sm text-gray-500 mb-4 flex gap-6">
            <span>By: {{ post.author }}</span>
            <span>{{ post.date }}</span>
            <span>0 Comments</span>
          </div>

          <h1 class="text-4xl mb-6">{{ post.title }}</h1>

          <div class="prose max-w-none text-gray-700 space-y-6" v-html="post.content" />
        </div>

        <div v-else class="py-20 text-center text-gray-500">
          Post not found. Check your route param and id.
        </div>
      </main>
    </div>
  </div>
</template>
