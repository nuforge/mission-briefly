import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { persistenceService } from '@/services/persistenceService'

/**
 * User preferences store - manages user settings and preferences
 * All preferences are persisted to localStorage
 */

interface ThemePreferences {
  mode: 'light' | 'dark' | 'auto'
  primaryColor: string
  density: 'default' | 'compact' | 'comfortable'
}

interface DataPreferences {
  autoSave: boolean
  dataRefreshInterval: number // minutes
  enableNotifications: boolean
}

interface ViewPreferences {
  defaultView: string
  cardsPerRow: number
  showDetails: boolean
  sortOrder: 'name' | 'date' | 'priority'
}

interface UserPreferences {
  theme: ThemePreferences
  data: DataPreferences
  view: ViewPreferences
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: {
    mode: 'auto',
    primaryColor: '#1976D2', // Material Design Blue
    density: 'default',
  },
  data: {
    autoSave: true,
    dataRefreshInterval: 5,
    enableNotifications: true,
  },
  view: {
    defaultView: 'dashboard',
    cardsPerRow: 3,
    showDetails: true,
    sortOrder: 'name',
  },
}

export const usePreferencesStore = defineStore('preferences', () => {
  // Load preferences from localStorage with defaults
  const preferences = ref<UserPreferences>(
    persistenceService.getLocal('userPreferences') || DEFAULT_PREFERENCES,
  )

  // Computed getters for easy access
  const themeMode = computed(() => preferences.value.theme.mode)
  const primaryColor = computed(() => preferences.value.theme.primaryColor)
  const density = computed(() => preferences.value.theme.density)
  const autoSave = computed(() => preferences.value.data.autoSave)
  const dataRefreshInterval = computed(() => preferences.value.data.dataRefreshInterval)
  const enableNotifications = computed(() => preferences.value.data.enableNotifications)
  const defaultView = computed(() => preferences.value.view.defaultView)
  const cardsPerRow = computed(() => preferences.value.view.cardsPerRow)
  const showDetails = computed(() => preferences.value.view.showDetails)
  const sortOrder = computed(() => preferences.value.view.sortOrder)

  // Actions to update preferences
  const updateThemeMode = (mode: 'light' | 'dark' | 'auto') => {
    preferences.value.theme.mode = mode
    persistPreferences()
  }

  const updatePrimaryColor = (color: string) => {
    preferences.value.theme.primaryColor = color
    persistPreferences()
  }

  const updateDensity = (density: 'default' | 'compact' | 'comfortable') => {
    preferences.value.theme.density = density
    persistPreferences()
  }

  const updateAutoSave = (enabled: boolean) => {
    preferences.value.data.autoSave = enabled
    persistPreferences()
  }

  const updateDataRefreshInterval = (minutes: number) => {
    preferences.value.data.dataRefreshInterval = Math.max(1, Math.min(60, minutes))
    persistPreferences()
  }

  const updateNotifications = (enabled: boolean) => {
    preferences.value.data.enableNotifications = enabled
    persistPreferences()
  }

  const updateDefaultView = (view: string) => {
    preferences.value.view.defaultView = view
    persistPreferences()
  }

  const updateCardsPerRow = (count: number) => {
    preferences.value.view.cardsPerRow = Math.max(1, Math.min(6, count))
    persistPreferences()
  }

  const updateShowDetails = (show: boolean) => {
    preferences.value.view.showDetails = show
    persistPreferences()
  }

  const updateSortOrder = (order: 'name' | 'date' | 'priority') => {
    preferences.value.view.sortOrder = order
    persistPreferences()
  }

  // Bulk update functions
  const updateThemePreferences = (theme: Partial<ThemePreferences>) => {
    preferences.value.theme = { ...preferences.value.theme, ...theme }
    persistPreferences()
  }

  const updateDataPreferences = (data: Partial<DataPreferences>) => {
    preferences.value.data = { ...preferences.value.data, ...data }
    persistPreferences()
  }

  const updateViewPreferences = (view: Partial<ViewPreferences>) => {
    preferences.value.view = { ...preferences.value.view, ...view }
    persistPreferences()
  }

  // Reset to defaults
  const resetToDefaults = () => {
    preferences.value = { ...DEFAULT_PREFERENCES }
    persistPreferences()
  }

  const resetThemeToDefaults = () => {
    preferences.value.theme = { ...DEFAULT_PREFERENCES.theme }
    persistPreferences()
  }

  const resetDataToDefaults = () => {
    preferences.value.data = { ...DEFAULT_PREFERENCES.data }
    persistPreferences()
  }

  const resetViewToDefaults = () => {
    preferences.value.view = { ...DEFAULT_PREFERENCES.view }
    persistPreferences()
  }

  // Persistence helper
  const persistPreferences = () => {
    persistenceService.setLocal('userPreferences', preferences.value)
  }

  // Import/Export functionality
  const exportPreferences = (): string => {
    return JSON.stringify(preferences.value, null, 2)
  }

  const importPreferences = (jsonString: string): boolean => {
    try {
      const imported: UserPreferences = JSON.parse(jsonString)

      // Validate the structure (basic validation)
      if (imported.theme && imported.data && imported.view) {
        preferences.value = imported
        persistPreferences()
        return true
      } else {
        console.warn('Invalid preferences structure')
        return false
      }
    } catch (error) {
      console.error('Failed to import preferences:', error)
      return false
    }
  }

  // Get current preferences as plain object
  const getCurrentPreferences = (): UserPreferences => {
    return { ...preferences.value }
  }

  return {
    // State
    preferences,

    // Computed getters
    themeMode,
    primaryColor,
    density,
    autoSave,
    dataRefreshInterval,
    enableNotifications,
    defaultView,
    cardsPerRow,
    showDetails,
    sortOrder,

    // Individual update actions
    updateThemeMode,
    updatePrimaryColor,
    updateDensity,
    updateAutoSave,
    updateDataRefreshInterval,
    updateNotifications,
    updateDefaultView,
    updateCardsPerRow,
    updateShowDetails,
    updateSortOrder,

    // Bulk update actions
    updateThemePreferences,
    updateDataPreferences,
    updateViewPreferences,

    // Reset actions
    resetToDefaults,
    resetThemeToDefaults,
    resetDataToDefaults,
    resetViewToDefaults,

    // Import/Export
    exportPreferences,
    importPreferences,
    getCurrentPreferences,
  }
})

export type { UserPreferences, ThemePreferences, DataPreferences, ViewPreferences }
