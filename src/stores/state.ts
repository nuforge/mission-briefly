import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { persistenceService } from '@/services/persistenceService'

/**
 * Application state store - manages UI state and navigation
 * Separate from game data to handle app-wide state concerns
 */
export const useStateStore = defineStore('state', () => {
  // Navigation state with persistence
  const navigationDrawer = ref(persistenceService.getLocal('navigationDrawer', false))
  const navigationExpanded = ref(
    persistenceService.getLocal('navigationExpanded', {
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
    persistenceService.setLocal('navigationDrawer', true)
  }

  const closeDrawer = () => {
    navigationDrawer.value = false
    persistenceService.setLocal('navigationDrawer', false)
  }

  const toggleDrawer = () => {
    navigationDrawer.value = !navigationDrawer.value
    persistenceService.setLocal('navigationDrawer', navigationDrawer.value)
  }

  const toggleNavigationSection = (section: 'missions' | 'ships' | 'crew') => {
    if (navigationExpanded.value) {
      navigationExpanded.value[section] = !navigationExpanded.value[section]
      persistenceService.setLocal('navigationExpanded', navigationExpanded.value)
    }
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
