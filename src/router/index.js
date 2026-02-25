import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HomeLayout from '@/layouts/HomeLayout.vue'
import Home from '@/pages/Home.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: HomeLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: Home,
        },
      ],
    },

    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: 'shop',
          component: () => import('@/pages/Shop.vue'),
          meta: { label: 'Shop' },
        },
        {
          path: 'about',
          component: () => import('@/pages/About.vue'),
          meta: { label: 'About' },
        },
        {
          path: 'login',
          component: () => import('@/pages/Login.vue'),
          meta: { label: 'Account' },
        },
        {
          path: 'register',
          component: () => import('@/pages/Register.vue'),
          meta: { label: 'Account' },
        },
        {
          path: 'cart',
          component: () => import('@/pages/Cart.vue'),
          meta: { label: 'Your Shoping Cart', requiresAuth: true },
        },
        {
          path: '/product/:id',
          component: () => import('@/pages/ProductDetails.vue'),
          meta: { label: 'Product' },
        },
        {
          path: 'checkout',
          component: () => import('@/pages/Checkout.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'wishlist',
          component: () => import('@/pages/Wishlist.vue'),
          meta: { label: 'Wishlist' },
        },
        {
          path: 'Blog',
          component: () => import('@/pages/Blog.vue'),
          meta: { label: 'Blog' },
        },
        {
          path: 'profile',
          component: () => import('@/pages/Profile.vue'),
          meta: { label: 'My Account', requiresAuth: true },
        },
        {
          path: '/blog/:id',
          component: () => import('@/pages/BlogDetails.vue'),
          meta: { label: 'Blog Post' },
        },
        {
          path: '/catalog',
          component: () => import('@/pages/Catalog.vue'),
          meta: { label: 'Catalog' },
        },
        {
          path: '/collections/:category',
          name: 'collection',
          component: () => import('@/pages/Collection.vue'),
          meta: { label: 'collections' },
        },
      ],
    },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return {
      path: '/login',
      query: { redirect: to.fullPath },
    }
  }
})

export default router
