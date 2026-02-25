import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import test from '../assets/img/test.png'
import test2 from '../assets/img/test2.png'
import test3 from '../assets/img/test3.png'
import test5 from '../assets/img/test5.png'

export const useBlogStore = defineStore('blog', () => {
  const posts = ref([
    {
      id: 1,
      title: 'Shirt pent Color Picking Guide',
      author: 'Lezada demo Admin',
      date: '2019-03-05',
      comments: 0,
      image: test2,
      excerpt: 'To say sequins and sparkles will be a big deal next summer is an understatement...',
      tags: ['shirt', 'color', 'guide'],
      category: 'fashion',
    },
    {
      id: 2,
      title: 'T-Shirts as Minimalist Style',
      author: 'Lezada demo Admin',
      date: '2019-01-29',
      comments: 1,
      image: test3,
      excerpt: 'Minimalist styling continues to grow across fashion capitals...',
      tags: ['minimalist', 'shirts'],
      category: 'style',
    },
    {
      id: 3,
      title: ' Perfect Perfume & Cologne',
      author: 'Lezada demo Admin',
      date: '2019-01-29',
      comments: 0,
      image: test5,
      excerpt: 'Perfume longevity depends on layering and skin chemistry...',
      tags: ['perfume', 'care'],
      category: 'beauty',
    },
    {
      id: 4,
      title: 'Tips to Lasting Perfume',
      author: 'Lezada demo Admin',
      date: '2019-01-29',
      comments: 0,
      image: test3,
      excerpt:
        'To say sequins and sparkles will be a big deal next summer is an understatement. In every fashion capital, glitter prevailed, starting with Tom Ford and Marc Jacobs right through...',
      tags: ['perfume', 'care'],
      category: 'beauty',
    },
    {
      id: 5,
      title: 'Tips to Lasting Perfume',
      author: 'Lezada demo Admin',
      date: '2019-01-29',
      comments: 0,
      image: test5,
      excerpt:
        'To say sequins and sparkles will be a big deal next summer is an understatement. In every fashion capital, glitter prevailed, starting with Tom Ford and Marc Jacobs right through...',
      tags: ['perfume', 'care'],
      category: 'beauty',
    },
    {
      id: 6,
      title: 'Perfect Perfume & Cologne',
      author: 'Lezada demo Admin',
      date: '2019-01-29',
      comments: 0,
      image: test,
      excerpt:
        'To say sequins and sparkles will be a big deal next summer is an understatement. In every fashion capital, glitter prevailed, starting with Tom Ford and Marc Jacobs right through...',
      tags: ['perfume', 'care'],
      category: 'beauty',
    },
  ])

  const recentPosts = computed(() => posts.value.slice(0, 3))

  const allTags = computed(() => {
    const tags = posts.value.flatMap((p) => p.tags)
    return [...new Set(tags)]
  })

  const archive = computed(() => {
    const map = {}
    posts.value.forEach((p) => {
      const month = new Date(p.date).toLocaleString('default', {
        month: 'long',
        year: 'numeric',
      })
      map[month] = map[month] || []
      map[month].push(p)
    })
    return map
  })

  return {
    posts,
    recentPosts,
    allTags,
    archive,
  }
})
