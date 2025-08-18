import { useGameDataStore } from '@/stores/gameData'
import { usePreferencesStore } from '@/stores/preferences'
import { useStateStore } from '@/stores/state'
import { persistenceService } from '@/services/persistenceService'

/**
 * Data Migration Service - Handles export/import of application data
 * Provides functionality to backup and restore user data and preferences
 */

interface ExportData {
  version: string
  timestamp: string
  preferences: any
  navigation: any
  sessionData: any
  metadata: {
    characters: number
    ships: number
    missions: number
  }
}

class DataMigrationService {
  private readonly version = '1.0.0'

  /**
   * Export all user data and preferences
   */
  async exportAllData(): Promise<string> {
    try {
      const gameDataStore = useGameDataStore()
      const preferencesStore = usePreferencesStore()
      const stateStore = useStateStore()

      const exportData: ExportData = {
        version: this.version,
        timestamp: new Date().toISOString(),
        preferences: preferencesStore.getCurrentPreferences(),
        navigation: {
          navigationDrawer: stateStore.navigationDrawer,
          navigationExpanded: stateStore.navigationExpanded,
        },
        sessionData: {
          selectedCharacterId: gameDataStore.selectedCharacterId,
          selectedShipId: gameDataStore.selectedShipId,
          selectedMissionId: gameDataStore.selectedMissionId,
          currentView: gameDataStore.currentView,
        },
        metadata: {
          characters: gameDataStore.totalCharacters,
          ships: gameDataStore.totalShips,
          missions: gameDataStore.totalMissions,
        },
      }

      return JSON.stringify(exportData, null, 2)
    } catch (error) {
      console.error('Failed to export data:', error)
      throw new Error(
        'Export failed: ' + (error instanceof Error ? error.message : 'Unknown error'),
      )
    }
  }

  /**
   * Import user data and preferences
   */
  async importAllData(jsonString: string): Promise<boolean> {
    try {
      const importData: ExportData = JSON.parse(jsonString)

      // Basic validation
      if (!importData.version || !importData.timestamp) {
        throw new Error('Invalid export format')
      }

      // Check version compatibility
      if (importData.version !== this.version) {
        console.warn(`Version mismatch. Current: ${this.version}, Import: ${importData.version}`)
        // Continue with import but warn user
      }

      const preferencesStore = usePreferencesStore()
      const stateStore = useStateStore()
      const gameDataStore = useGameDataStore()

      // Import preferences
      if (importData.preferences) {
        const success = preferencesStore.importPreferences(JSON.stringify(importData.preferences))
        if (!success) {
          console.warn('Failed to import preferences')
        }
      }

      // Import navigation state
      if (importData.navigation) {
        if (importData.navigation.navigationDrawer !== undefined) {
          if (importData.navigation.navigationDrawer) {
            stateStore.openDrawer()
          } else {
            stateStore.closeDrawer()
          }
        }

        if (importData.navigation.navigationExpanded) {
          // Update navigation expanded state directly via persistence
          persistenceService.setLocal(
            'navigationExpanded',
            importData.navigation.navigationExpanded,
          )
          // Note: The store will pick this up on next reload
        }
      }

      // Import session data (optional - user might not want to restore session)
      if (importData.sessionData) {
        if (importData.sessionData.selectedCharacterId) {
          gameDataStore.setSelectedCharacter(importData.sessionData.selectedCharacterId)
        }
        if (importData.sessionData.selectedShipId) {
          gameDataStore.setSelectedShip(importData.sessionData.selectedShipId)
        }
        if (importData.sessionData.selectedMissionId) {
          gameDataStore.setSelectedMission(importData.sessionData.selectedMissionId)
        }
        if (importData.sessionData.currentView) {
          gameDataStore.setCurrentView(importData.sessionData.currentView)
        }
      }

      return true
    } catch (error) {
      console.error('Failed to import data:', error)
      throw new Error(
        'Import failed: ' + (error instanceof Error ? error.message : 'Unknown error'),
      )
    }
  }

  /**
   * Export only preferences (smaller export)
   */
  async exportPreferences(): Promise<string> {
    try {
      const preferencesStore = usePreferencesStore()
      return preferencesStore.exportPreferences()
    } catch (error) {
      console.error('Failed to export preferences:', error)
      throw new Error('Preferences export failed')
    }
  }

  /**
   * Import only preferences
   */
  async importPreferences(jsonString: string): Promise<boolean> {
    try {
      const preferencesStore = usePreferencesStore()
      return preferencesStore.importPreferences(jsonString)
    } catch (error) {
      console.error('Failed to import preferences:', error)
      return false
    }
  }

  /**
   * Clear all application data
   */
  async clearAllData(): Promise<void> {
    try {
      const gameDataStore = useGameDataStore()
      const preferencesStore = usePreferencesStore()

      // Clear session data
      gameDataStore.clearSessionState()

      // Reset preferences to defaults
      preferencesStore.resetToDefaults()

      // Clear all localStorage
      persistenceService.clearLocal()

      // Clear all sessionStorage
      persistenceService.clearSession()

      console.log('All application data cleared')
    } catch (error) {
      console.error('Failed to clear data:', error)
      throw new Error(
        'Clear data failed: ' + (error instanceof Error ? error.message : 'Unknown error'),
      )
    }
  }

  /**
   * Get storage usage statistics
   */
  getStorageInfo() {
    const stats = persistenceService.getStorageStats()
    const availability = persistenceService.isStorageAvailable()

    return {
      usage: {
        localStorageBytes: stats.local,
        sessionStorageBytes: stats.session,
        totalBytes: stats.local + stats.session,
        localStorageKB: Math.round((stats.local / 1024) * 100) / 100,
        sessionStorageKB: Math.round((stats.session / 1024) * 100) / 100,
        totalKB: Math.round(((stats.local + stats.session) / 1024) * 100) / 100,
      },
      availability: {
        localStorage: availability.local,
        sessionStorage: availability.session,
        bothAvailable: availability.local && availability.session,
      },
    }
  }

  /**
   * Create backup with automatic filename
   */
  generateBackupFilename(): string {
    const now = new Date()
    const date = now.toISOString().split('T')[0] // YYYY-MM-DD
    const time = now.toTimeString().split(' ')[0].replace(/:/g, '-') // HH-MM-SS
    return `mission-briefly-backup-${date}-${time}.json`
  }

  /**
   * Download export data as file
   */
  async downloadBackup(): Promise<void> {
    try {
      const exportData = await this.exportAllData()
      const filename = this.generateBackupFilename()

      // Create and trigger download
      const blob = new Blob([exportData], { type: 'application/json' })
      const url = URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      URL.revokeObjectURL(url)

      console.log('Backup downloaded:', filename)
    } catch (error) {
      console.error('Failed to download backup:', error)
      throw new Error('Download failed')
    }
  }
}

// Export singleton instance
export const dataMigrationService = new DataMigrationService()

// Export class for custom instances
export default DataMigrationService
