/**
 * Persistence Service - Handles data persistence to localStorage and sessionStorage
 * Provides a consistent interface for storing and retrieving application data
 */

interface StorageConfig {
  storage: Storage
  prefix: string
}

interface PersistenceOptions {
  expiry?: number // milliseconds until expiry
  compress?: boolean // future feature for data compression
}

interface StoredItem<T> {
  data: T
  timestamp: number
  expiry?: number
  version: string
}

class PersistenceService {
  private localStorage: StorageConfig
  private sessionStorage: StorageConfig
  private readonly version = '1.0.0'

  constructor() {
    this.localStorage = {
      storage: window.localStorage,
      prefix: 'mission-briefly-',
    }
    this.sessionStorage = {
      storage: window.sessionStorage,
      prefix: 'mb-session-',
    }
  }

  /**
   * Store data in localStorage (persistent across sessions)
   */
  setLocal<T>(key: string, data: T, options: PersistenceOptions = {}): void {
    this.setItem(this.localStorage, key, data, options)
  }

  /**
   * Get data from localStorage
   */
  getLocal<T>(key: string, defaultValue?: T): T | undefined {
    return this.getItem<T>(this.localStorage, key, defaultValue)
  }

  /**
   * Store data in sessionStorage (cleared when tab closes)
   */
  setSession<T>(key: string, data: T, options: PersistenceOptions = {}): void {
    this.setItem(this.sessionStorage, key, data, options)
  }

  /**
   * Get data from sessionStorage
   */
  getSession<T>(key: string, defaultValue?: T): T | undefined {
    return this.getItem<T>(this.sessionStorage, key, defaultValue)
  }

  /**
   * Remove item from localStorage
   */
  removeLocal(key: string): void {
    this.removeItem(this.localStorage, key)
  }

  /**
   * Remove item from sessionStorage
   */
  removeSession(key: string): void {
    this.removeItem(this.sessionStorage, key)
  }

  /**
   * Clear all items with our prefix from localStorage
   */
  clearLocal(): void {
    this.clearStorage(this.localStorage)
  }

  /**
   * Clear all items with our prefix from sessionStorage
   */
  clearSession(): void {
    this.clearStorage(this.sessionStorage)
  }

  /**
   * Generic method to store data with metadata
   */
  private setItem<T>(
    config: StorageConfig,
    key: string,
    data: T,
    options: PersistenceOptions,
  ): void {
    try {
      const item: StoredItem<T> = {
        data,
        timestamp: Date.now(),
        version: this.version,
      }

      if (options.expiry) {
        item.expiry = Date.now() + options.expiry
      }

      const serialized = JSON.stringify(item)
      const storageKey = config.prefix + key

      config.storage.setItem(storageKey, serialized)
    } catch (error) {
      console.warn(`Failed to persist data for key "${key}":`, error)

      // If storage is full, try to clean up expired items
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        this.cleanExpiredItems(config)

        // Try again after cleanup
        try {
          const item: StoredItem<T> = {
            data,
            timestamp: Date.now(),
            version: this.version,
          }
          if (options.expiry) {
            item.expiry = Date.now() + options.expiry
          }
          config.storage.setItem(config.prefix + key, JSON.stringify(item))
        } catch (retryError) {
          console.error(`Failed to persist data for key "${key}" even after cleanup:`, retryError)
        }
      }
    }
  }

  /**
   * Generic method to retrieve data with metadata validation
   */
  private getItem<T>(config: StorageConfig, key: string, defaultValue?: T): T | undefined {
    try {
      const storageKey = config.prefix + key
      const serialized = config.storage.getItem(storageKey)

      if (!serialized) {
        return defaultValue
      }

      const item: StoredItem<T> = JSON.parse(serialized)

      // Check version compatibility (basic check)
      if (item.version && item.version !== this.version) {
        console.warn(
          `Version mismatch for key "${key}". Expected ${this.version}, got ${item.version}`,
        )
        // For now, we'll continue but this could be a place for migration logic
      }

      // Check expiry
      if (item.expiry && Date.now() > item.expiry) {
        this.removeItem(config, key)
        return defaultValue
      }

      return item.data
    } catch (error) {
      console.warn(`Failed to retrieve data for key "${key}":`, error)
      return defaultValue
    }
  }

  /**
   * Remove a single item
   */
  private removeItem(config: StorageConfig, key: string): void {
    try {
      config.storage.removeItem(config.prefix + key)
    } catch (error) {
      console.warn(`Failed to remove item "${key}":`, error)
    }
  }

  /**
   * Clear all items with our prefix
   */
  private clearStorage(config: StorageConfig): void {
    try {
      const keysToRemove: string[] = []

      for (let i = 0; i < config.storage.length; i++) {
        const key = config.storage.key(i)
        if (key && key.startsWith(config.prefix)) {
          keysToRemove.push(key)
        }
      }

      keysToRemove.forEach((key) => {
        config.storage.removeItem(key)
      })
    } catch (error) {
      console.warn('Failed to clear storage:', error)
    }
  }

  /**
   * Clean up expired items to free storage space
   */
  private cleanExpiredItems(config: StorageConfig): void {
    try {
      const now = Date.now()
      const keysToRemove: string[] = []

      for (let i = 0; i < config.storage.length; i++) {
        const key = config.storage.key(i)
        if (key && key.startsWith(config.prefix)) {
          try {
            const serialized = config.storage.getItem(key)
            if (serialized) {
              const item: StoredItem<any> = JSON.parse(serialized)
              if (item.expiry && now > item.expiry) {
                keysToRemove.push(key)
              }
            }
          } catch (error) {
            // If we can't parse an item, it's probably corrupted - remove it
            keysToRemove.push(key)
          }
        }
      }

      keysToRemove.forEach((key) => {
        config.storage.removeItem(key)
      })

      if (keysToRemove.length > 0) {
        console.log(`Cleaned up ${keysToRemove.length} expired/corrupted items`)
      }
    } catch (error) {
      console.warn('Failed to clean expired items:', error)
    }
  }

  /**
   * Get storage usage statistics
   */
  getStorageStats(): { local: number; session: number } {
    return {
      local: this.getStorageSize(this.localStorage),
      session: this.getStorageSize(this.sessionStorage),
    }
  }

  /**
   * Get approximate storage size for our keys
   */
  private getStorageSize(config: StorageConfig): number {
    let totalSize = 0
    try {
      for (let i = 0; i < config.storage.length; i++) {
        const key = config.storage.key(i)
        if (key && key.startsWith(config.prefix)) {
          const value = config.storage.getItem(key)
          if (value) {
            totalSize += key.length + value.length
          }
        }
      }
    } catch (error) {
      console.warn('Failed to calculate storage size:', error)
    }
    return totalSize
  }

  /**
   * Check if storage is available
   */
  isStorageAvailable(): { local: boolean; session: boolean } {
    return {
      local: this.checkStorageAvailability(this.localStorage.storage),
      session: this.checkStorageAvailability(this.sessionStorage.storage),
    }
  }

  /**
   * Test if a storage mechanism is available and working
   */
  private checkStorageAvailability(storage: Storage): boolean {
    try {
      const testKey = '__storage_test__'
      storage.setItem(testKey, 'test')
      storage.removeItem(testKey)
      return true
    } catch {
      return false
    }
  }
}

// Export singleton instance
export const persistenceService = new PersistenceService()

// Export class for custom instances
export default PersistenceService
