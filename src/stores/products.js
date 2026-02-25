import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useProductsStore = defineStore('products', () => {
  const products = ref([])
  const pagination = ref({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
  })
  const allProducts = ref([])
  const allLoaded = ref(false)
  const allLoading = ref(false)
  const loading = ref(false)
  const error = ref(null)
  const gridCols = ref(3)
  const sortBy = ref('az')
  const tab = ref('all')

  const fetchProducts = async (page = 1) => {
    loading.value = true
    error.value = null

    try {
      const perPage = pagination.value.per_page ?? 20

      /*const res = await api.get('/products', {
        params: {
          page,
          per_page: perPage,
          ...(tab.value !== 'all' ? { tab: tab.value } : {}),
        },
      })*/

      const params = {
        page,
        per_page: perPage,
        ...(tab.value !== 'all' ? { tab: tab.value } : {}),
      }

      const res = await api.get('/products', { params })
      const payload = res.data || {}

      products.value = Array.isArray(payload.data) ? payload.data : []

      const meta = payload.meta || payload

      pagination.value = {
        current_page: meta.current_page ?? page,
        last_page: meta.last_page ?? 1,
        per_page: meta.per_page ?? perPage,
        total: meta.total ?? products.value.length,
      }
    } catch (e) {
      products.value = []
      pagination.value = { current_page: 1, last_page: 1, per_page: 20, total: 0 }
      error.value = 'Failed to load products'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  const fetchAllProducts = async () => {
    if (allLoaded.value || allLoading.value) return

    allLoading.value = true
    error.value = null

    try {
      const perPage = 50
      const baseParams = {
        per_page: perPage,
        ...(tab.value !== 'all' ? { tab: tab.value } : {}),
      }

      const first = await api.get('/products', { params: { ...baseParams, page: 1 } })
      const p1 = first.data || {}

      const firstList = Array.isArray(p1.data) ? p1.data : []
      const last = Number(p1.last_page ?? p1.lastPage ?? 1)

      const results = [...firstList]

      for (let page = 2; page <= last; page++) {
        const r = await api.get('/products', { params: { ...baseParams, page } })
        const d = r.data || {}
        const list = Array.isArray(d.data) ? d.data : []
        results.push(...list)
      }

      const map = new Map()
      for (const item of results) {
        if (item?.id != null) map.set(item.id, item)
      }

      allProducts.value = Array.from(map.values())
      allLoaded.value = true
    } catch (e) {
      allProducts.value = []
      allLoaded.value = false
      error.value = 'Failed to load full catalog'
      console.error(e)
    } finally {
      allLoading.value = false
    }
  }

  const catalogCategories = computed(() => {
    const map = new Map()
    for (const p of allProducts.value) {
      const cat = p?.category || 'Uncategorized'
      if (!map.has(cat)) map.set(cat, { name: cat, count: 0, image: '' })
      const item = map.get(cat)
      item.count += 1
      if (!item.image && p?.image) item.image = p.image
    }
    return Array.from(map.values())
  })

  const goToPage = (page) => {
    const p = Number(page)
    if (!Number.isFinite(p)) return

    const last = pagination.value.last_page ?? 1
    const safe = Math.min(Math.max(p, 1), last)
    fetchProducts(safe)
  }

  const nextPage = () => goToPage((pagination.value.current_page ?? 1) + 1)
  const prevPage = () => goToPage((pagination.value.current_page ?? 1) - 1)

  const setGridCols = (n) => {
    if ([2, 3, 4].includes(Number(n))) gridCols.value = Number(n)
  }
  const setSortBy = (v) => {
    sortBy.value = v
  }
  const setTab = async (v) => {
    tab.value = v
    await fetchProducts(1)
  }

  const getProducts = computed(() => products.value)
  const getPagination = computed(() => pagination.value)

  return {
    products,
    pagination,
    loading,
    error,

    gridCols,
    sortBy,

    fetchProducts,
    goToPage,
    nextPage,
    prevPage,

    getProducts,
    getPagination,

    allProducts,
    allLoaded,
    allLoading,

    setGridCols,
    setSortBy,
    setTab,
    fetchAllProducts,

    catalogCategories,
  }
})
