import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

/**
 * Application state store - manages UI state and navigation
 * Separate from game data to handle app-wide state concerns
 */
export const useStateStore = defineStore('state', () => {
  // Load initial state from localStorage
  const getStoredValue = (key: string, defaultValue: any) => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(`mission-briefly-${key}`)
      return stored ? JSON.parse(stored) : defaultValue
    }
    return defaultValue
  }

  const setStoredValue = (key: string, value: any) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`mission-briefly-${key}`, JSON.stringify(value))
    }
  }

  // Navigation state with persistence
  const navigationDrawer = ref(getStoredValue('navigationDrawer', false))
  const navigationExpanded = ref(
    getStoredValue('navigationExpanded', {
      missions: true,
      ships: true,
      crew: true,
    }),
  )

  // App state
  const currentPage = ref('home')
  const pageTitle = ref('Mission Briefly')
  const isLoading = ref(false)
  const notifications = ref<
    Array<{ id: string; message: string; type: 'info' | 'success' | 'warning' | 'error' }>
  >([])

  // Navigation actions
  const openDrawer = () => {
    navigationDrawer.value = true
    setStoredValue('navigationDrawer', true)
  }

  const closeDrawer = () => {
    navigationDrawer.value = false
    setStoredValue('navigationDrawer', false)
  }

  const toggleDrawer = () => {
    navigationDrawer.value = !navigationDrawer.value
    setStoredValue('navigationDrawer', navigationDrawer.value)
  }

  const toggleNavigationSection = (section: 'missions' | 'ships' | 'crew') => {
    navigationExpanded.value[section] = !navigationExpanded.value[section]
    setStoredValue('navigationExpanded', navigationExpanded.value)
  }

  // Page state actions
  const setCurrentPage = (page: string) => {
    currentPage.value = page
  }

  const setPageTitle = (title: string) => {
    pageTitle.value = title
    // Update document title
    document.title = `${title} - Mission Briefly`
  }

  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }

  // Notification actions
  const addNotification = (
    message: string,
    type: 'info' | 'success' | 'warning' | 'error' = 'info',
  ) => {
    const id = Date.now().toString()
    notifications.value.push({ id, message, type })

    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeNotification(id)
    }, 5000)

    return id
  }

  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex((n) => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  const clearNotifications = () => {
    notifications.value = []
  }

  // Computed getters
  const hasNotifications = computed(() => notifications.value.length > 0)
  const notificationCount = computed(() => notifications.value.length)

  return {
    // State
    navigationDrawer,
    navigationExpanded,
    currentPage,
    pageTitle,
    isLoading,
    notifications,

    // Actions
    openDrawer,
    closeDrawer,
    toggleDrawer,
    toggleNavigationSection,
    setCurrentPage,
    setPageTitle,
    setLoading,
    addNotification,
    removeNotification,
    clearNotifications,

    // Computed
    hasNotifications,
    notificationCount,
  }
})

export default useStateStore
