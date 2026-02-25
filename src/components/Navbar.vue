<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { Heart, LogOut, Search, ShoppingCart, User, X } from 'lucide-vue-next'
import { useProductsStore } from '@/stores/products'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const cart = useCartStore()
const wishlist = useWishlistStore()
const productsStore = useProductsStore()

const route = useRoute()
const router = useRouter()

const showCatalog = ref(false)

const showCart = ref(false)
const closeCart = () => {
  showCart.value = false
}

watch(
  () => route.fullPath,
  () => {
    showCart.value = false
  },
)

watch(showCart, (val) => {
  document.body.style.overflow = val ? 'hidden' : ''
})

const showSearch = ref(false)
const searchQuery = ref('')

const searchResults = computed(() => {
  if (!searchQuery.value) return []

  return (productsStore.products || []).filter((product) =>
    (product.title || product.name || '').toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

watch(showSearch, (val) => {
  if (!val) searchQuery.value = ''
})

const showLogoutConfirm = ref(false)

const handleLogout = async () => {
  try {
    await auth.logout()
  } finally {
    showLogoutConfirm.value = false
    closeCart()
    router.push('/login')
  }
}

const cartBadgeCount = computed(() => cart.totalItems ?? 0)

const cartLineItems = computed(() =>
  (cart.items || []).map((item) => {
    const p = item.product || item // fallback
    return {
      id: item.id,
      title: p.title || p.name || 'Product',
      image: p.image || p.thumbnail || '',
      price: Number(p.price || item.price || 0),
      quantity: Number(item.quantity || item.qty || 1),
    }
  }),
)

const featuredProduct = computed(() => {
  if (!Array.isArray(productsStore.products)) return null
  return productsStore.products.find((p) => p.category === 'Fashion')
})

const catalogColumns = [
  {
    title: 'Popular',
    items: ['Casual', 'Exclusive', 'Aligori', 'Churidar', 'Shalwar', 'Jeans', 'Dress'],
  },
  {
    title: 'Best Selling',
    items: ['Sandals', 'Blucher shoe', 'Boat shoe', 'Brogan', 'Chelsea boot'],
  },
  {
    title: 'New Product',
    items: ['Belt', 'Wallets', 'Card Holders', 'Bags', 'Executive bag', 'Cufflinks', 'Cap'],
  },
]

onMounted(async () => {
  if (!productsStore.products.length) {
    productsStore.fetchProducts()
  }

  if (auth.isAuthenticated) {
    await cart.fetchCart()
  }
})

watch(
  () => auth.isAuthenticated,
  async (isAuth) => {
    if (isAuth) {
      await cart.fetchCart()
    } else {
      cart.items = []
    }
  },
)
</script>

<template>
  <header class="w-full bg-white z-50 absolute top-0 left-0 text-gray-800">
    <div class="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
      <RouterLink to="/" class="text-xl font-bold"> LEZADA </RouterLink>

      <nav class="hidden md:flex gap-10 text-sm text-gray-600">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/shop">Shop</RouterLink>

        <div class="relative group cursor-pointer">
          <span class="grid">
            <RouterLink to="/catalog" class="pointer-cursor">Catalog</RouterLink>
            <span
              class="absolute -top-3 -right-5 bg-[#98d8ca] text-white rounded-full text-xs px-2"
            >
              SALE
            </span>
          </span>

          <div
            class="absolute left-1/2 -translate-x-1/2 top-full w-275 bg-white shadow-lg p-10 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 translate-y-3 transition duration-200"
          >
            <div class="grid grid-cols-4 gap-10">
              <div v-for="(col, i) in catalogColumns" :key="i" class="border-r border-gray-200">
                <h4 class="font-semibold mb-4">{{ col.title }}</h4>
                <ul class="space-y-3 text-sm text-gray-600">
                  <li v-for="item in col.items" :key="item">
                    <RouterLink to="/shop" class="hover:text-black">
                      {{ item }}
                    </RouterLink>
                  </li>
                </ul>
              </div>

              <div v-if="featuredProduct">
                <RouterLink :to="`/product/${featuredProduct.id}`">
                  <img :src="featuredProduct.image" class="w-full h-48 object-contain mb-4" />
                </RouterLink>

                <RouterLink
                  :to="`/product/${featuredProduct.id}`"
                  class="block font-medium hover:underline"
                >
                  {{ featuredProduct.title || featuredProduct.name }}
                </RouterLink>

                <div class="flex gap-2 text-sm">
                  <span class="font-semibold">${{ featuredProduct.price }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <RouterLink to="/blog" class="cursor-pointer hover:boder-b"> Blog </RouterLink>
        <RouterLink to="/blog" class="cursor-pointer hover:boder-b"> Page </RouterLink>
      </nav>

      <div class="flex gap-5 text-gray-600 relative">
        <button @click="showSearch = true">
          <Search class="w-5 h-5" />
        </button>

        <RouterLink v-if="!auth.isAuthenticated" to="/login">
          <User class="w-5 h-5" />
        </RouterLink>

        <button
          v-else
          @click="showLogoutConfirm = true"
          class="flex items-center gap-2 text-sm cursor-pointer hover:text-black"
        >
          <span class="hidden md:inline"><LogOut class="w-5 h-5" /></span>
        </button>

        <RouterLink to="/wishlist" class="relative">
          <Heart class="w-5 h-5" />
          <span
            v-if="wishlist.items.length"
            class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1"
          >
            {{ wishlist.items.length }}
          </span>
        </RouterLink>

        <button class="relative" @click="showCart = true">
          <ShoppingCart class="w-5 h-5" />
          <span
            v-if="cartBadgeCount"
            class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1"
          >
            {{ cartBadgeCount }}
          </span>
        </button>
      </div>
    </div>
  </header>

  <div v-if="showCart" class="fixed inset-0 bg-black/50 z-50" @click.self="closeCart">
    <div
      class="absolute right-0 top-0 h-full w-96 bg-white p-6 overflow-y-auto transform transition-transform duration-300 ease-in-out"
      :class="showCart ? 'translate-x-0' : 'translate-x-full'"
    >
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg font-medium">Cart</h2>
        <button @click="closeCart">
          <X class="w-5 h-5" />
        </button>
      </div>

      <div v-if="cartLineItems.length" class="space-y-4">
        <div
          v-for="item in cartLineItems"
          :key="item.id"
          class="flex gap-4 items-center border-b pb-4"
        >
          <img v-if="item.image" :src="item.image" class="w-16 h-16 object-contain" />
          <div class="flex-1">
            <p class="text-sm">{{ item.name }}</p>
            <p class="text-sm text-gray-500">$ {{ item.price.toFixed(2) }} x {{ item.quantity }}</p>
          </div>
          <p class="text-sm font-medium">$ {{ (item.price * item.quantity).toFixed(2) }}</p>
        </div>

        <div class="flex justify-between font-medium pt-4">
          <span>Total:</span>
          <span>$ {{ Number(cart.totalPrice || 0).toFixed(2) }}</span>
        </div>

        <RouterLink
          to="/checkout"
          class="block text-center bg-red-600 text-white py-3 mt-4"
          @click="closeCart"
        >
          CHECKOUT
        </RouterLink>

        <RouterLink
          to="/cart"
          class="block text-center bg-gray-800 text-white py-3 mt-2"
          @click="closeCart"
        >
          VIEW CART
        </RouterLink>
      </div>

      <p v-else class="text-gray-500">Your cart is empty.</p>
    </div>
  </div>

  <!-- SEARCH -->
  <div v-if="showSearch" class="fixed inset-0 bg-white z-50 overflow-y-auto">
    <button class="absolute top-10 right-10 cursor-pointer" @click="showSearch = false">
      <X class="w-10 h-10" />
    </button>

    <div class="max-w-5xl mx-auto my-76 px-6">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search our store"
        class="w-full text-5xl font-light border-b border-black outline-none pb-4"
        autofocus
      />

      <div class="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <RouterLink
          v-for="product in searchResults"
          :key="product.id"
          to="/shop"
          @click="showSearch = false"
          class="flex gap-4 items-center hover:bg-gray-50 p-4 transition"
        >
          <img :src="product.image" class="w-20 h-20 object-contain" />
          <div>
            <p class="text-sm font-medium">{{ product.title ?? product.name }}</p>
            <p class="text-sm text-gray-500">$ {{ product.price }}</p>
          </div>
        </RouterLink>

        <p v-if="searchQuery && !searchResults.length" class="text-gray-500">No products found.</p>
      </div>
    </div>
  </div>

  <!-- LOGOUT CONFIRM -->
  <div
    v-if="showLogoutConfirm"
    class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
  >
    <div class="bg-white w-96 p-6 rounded-lg">
      <h3 class="text-lg font-medium mb-4">Confirm Logout</h3>
      <p class="text-sm text-gray-600 mb-6">Are you sure you want to log out?</p>

      <div class="flex justify-end gap-4">
        <button @click="showLogoutConfirm = false" class="px-4 py-2 text-sm border rounded">
          Cancel
        </button>

        <button @click="handleLogout" class="px-4 py-2 text-sm bg-red-600 text-white rounded">
          Logout
        </button>
      </div>
    </div>
  </div>
</template>
