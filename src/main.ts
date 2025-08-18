import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import vuetify from './vuetify'

import App from './App.vue'
import router from './router'
import { useStateStore } from '@/stores/state'

// Import performance monitoring
import { performanceMonitor, logBundleReport } from '@/utils/performanceMonitor'

const app = createApp(App)

app.use(createPinia())
app.use(vuetify)
app.use(router)

// Connect router to state store for navigation tracking
const stateStore = useStateStore()

// Set up route change tracking
router.beforeEach((to, from, next) => {
  // Update page state
  stateStore.setCurrentPage((to.name as string) || 'unknown')

  // Set page title based on route
  const pageTitle =
    (to.meta?.title as string) ||
    (to.name as string)?.charAt(0).toUpperCase() + (to.name as string)?.slice(1) ||
    'Mission Briefly'
  stateStore.setPageTitle(pageTitle)

  next()
})

app.mount('#app')

// Log performance metrics in development
if (import.meta.env.DEV) {
  // Set up route change performance monitoring
  router.beforeEach((to, from, next) => {
    const startTime = performance.now()
    router.currentRoute.value.meta = { ...router.currentRoute.value.meta, startTime }
    next()
  })

  router.afterEach((to) => {
    const startTime = to.meta.startTime as number
    if (startTime) {
      performanceMonitor.measureRouteChangeTime(startTime)
    }
  })

  // Initial performance report
  window.addEventListener('load', () => {
    setTimeout(logBundleReport, 2000)
  })
}
