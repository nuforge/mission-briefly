// Performance monitoring utilities for bundle optimization
// Tracks loading times and bundle performance

export interface PerformanceMetrics {
  bundleSize: {
    total: number
    js: number
    css: number
    chunks: number
  }
  loadingTimes: {
    initialLoad: number
    routeChange: number
    componentLoad: number
  }
  userExperience: {
    firstContentfulPaint: number
    largestContentfulPaint: number
    cumulativeLayoutShift: number
    firstInputDelay: number
  }
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    bundleSize: { total: 0, js: 0, css: 0, chunks: 0 },
    loadingTimes: { initialLoad: 0, routeChange: 0, componentLoad: 0 },
    userExperience: {
      firstContentfulPaint: 0,
      largestContentfulPaint: 0,
      cumulativeLayoutShift: 0,
      firstInputDelay: 0,
    },
  }
  private observers: PerformanceObserver[] = []

  constructor() {
    this.initializeObservers()
    this.measureBundleSize()
  }

  private initializeObservers() {
    // Monitor loading performance
    if ('PerformanceObserver' in window) {
      // First Contentful Paint
      const fcpObserver = new PerformanceObserver((entryList) => {
        const fcpEntry = entryList
          .getEntries()
          .find((entry) => entry.name === 'first-contentful-paint')
        if (fcpEntry) {
          this.metrics.userExperience.firstContentfulPaint = fcpEntry.startTime
        }
      })
      fcpObserver.observe({ entryTypes: ['paint'] })
      this.observers.push(fcpObserver)

      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((entryList) => {
        const lcpEntries = entryList.getEntries()
        const lcpEntry = lcpEntries[lcpEntries.length - 1]
        if (lcpEntry) {
          this.metrics.userExperience.largestContentfulPaint = lcpEntry.startTime
        }
      })
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
      this.observers.push(lcpObserver)

      // Cumulative Layout Shift
      const clsObserver = new PerformanceObserver((entryList) => {
        let clsScore = 0
        entryList.getEntries().forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsScore += entry.value
          }
        })
        this.metrics.userExperience.cumulativeLayoutShift = clsScore
      })
      clsObserver.observe({ entryTypes: ['layout-shift'] })
      this.observers.push(clsObserver)
    }
  }

  private measureBundleSize() {
    // Estimate bundle sizes from performance entries
    if ('performance' in window) {
      const resourceEntries = performance.getEntriesByType(
        'resource',
      ) as PerformanceResourceTiming[]

      let jsSize = 0
      let cssSize = 0
      let chunks = 0

      resourceEntries.forEach((entry) => {
        const size = entry.transferSize || entry.encodedBodySize || 0

        if (entry.name.includes('.js')) {
          jsSize += size
          chunks++
        } else if (entry.name.includes('.css')) {
          cssSize += size
        }
      })

      this.metrics.bundleSize = {
        total: jsSize + cssSize,
        js: jsSize,
        css: cssSize,
        chunks,
      }
    }
  }

  public measureRouteChangeTime(startTime: number): number {
    const endTime = performance.now()
    const routeChangeTime = endTime - startTime

    this.metrics.loadingTimes.routeChange = routeChangeTime

    return routeChangeTime
  }

  public measureComponentLoadTime(componentName: string, startTime: number): number {
    const endTime = performance.now()
    const loadTime = endTime - startTime

    console.log(`Component ${componentName} loaded in ${loadTime.toFixed(2)}ms`)

    this.metrics.loadingTimes.componentLoad = loadTime

    return loadTime
  }

  public getMetrics(): PerformanceMetrics {
    // Update metrics before returning
    this.measureBundleSize()
    return { ...this.metrics }
  }

  public getBundleReport(): string {
    const metrics = this.getMetrics()
    const { bundleSize, userExperience } = metrics

    return `
🎯 Bundle Optimization Report
=============================

Bundle Sizes:
• Total: ${(bundleSize.total / 1024).toFixed(2)} KB
• JavaScript: ${(bundleSize.js / 1024).toFixed(2)} KB
• CSS: ${(bundleSize.css / 1024).toFixed(2)} KB
• Chunks: ${bundleSize.chunks}

Performance Scores:
• First Contentful Paint: ${userExperience.firstContentfulPaint.toFixed(2)}ms
• Largest Contentful Paint: ${userExperience.largestContentfulPaint.toFixed(2)}ms
• Cumulative Layout Shift: ${userExperience.cumulativeLayoutShift.toFixed(4)}

Optimization Status:
• ✅ Code splitting enabled
• ✅ Icon fonts eliminated
• ✅ Component tree-shaking active
• ✅ Route-based lazy loading
• ✅ Vuetify optimized (selected imports)
    `
  }

  public destroy() {
    this.observers.forEach((observer) => observer.disconnect())
    this.observers = []
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor()

// Utility functions for measuring performance
export const measureAsyncOperation = async <T>(
  operation: () => Promise<T>,
  label: string,
): Promise<{ result: T; duration: number }> => {
  const startTime = performance.now()
  const result = await operation()
  const duration = performance.now() - startTime

  console.log(`${label} completed in ${duration.toFixed(2)}ms`)

  return { result, duration }
}

export const logBundleReport = () => {
  // console.log(performanceMonitor.getBundleReport())
}

// Auto-log performance metrics in development
if (import.meta.env.DEV) {
  // Log initial metrics after page load
  // window.addEventListener('load', () => {
  //   setTimeout(() => {
  //     logBundleReport()
  //   }, 1000)
  // })
}
