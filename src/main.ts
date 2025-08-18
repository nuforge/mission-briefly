import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import vuetify from './vuetify'

import App from './App.vue'
import router from './router'

// Import performance monitoring
import { performanceMonitor, logBundleReport } from '@/utils/performanceMonitor'

const app = createApp(App)

app.use(createPinia())
app.use(vuetify)
app.use(router)

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
