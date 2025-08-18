import { MissionBrieflyError } from './MissionBrieflyError'

/**
 * Error logging and reporting utilities
 */

export interface ErrorLogEntry {
  timestamp: Date
  error: Error
  context?: any
  userAgent?: string
  url?: string
  userId?: string
  sessionId?: string
}

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
}

class ErrorLogger {
  private logs: ErrorLogEntry[] = []
  private maxLogs: number = 1000
  private logLevel: LogLevel = LogLevel.WARN

  /**
   * Set the minimum log level
   */
  setLogLevel(level: LogLevel): void {
    this.logLevel = level
  }

  /**
   * Set the maximum number of logs to keep in memory
   */
  setMaxLogs(max: number): void {
    this.maxLogs = max
  }

  /**
   * Log an error with context
   */
  logError(error: Error, context?: any, level: LogLevel = LogLevel.ERROR): void {
    if (level < this.logLevel) {
      return
    }

    const entry: ErrorLogEntry = {
      timestamp: new Date(),
      error,
      context,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
    }

    this.logs.push(entry)

    // Keep only the most recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs)
    }

    // Console logging based on level
    this.consoleLog(entry, level)

    // Send to external service in production (placeholder)
    if (import.meta.env.PROD && level >= LogLevel.ERROR) {
      this.sendToExternalService(entry)
    }
  }

  /**
   * Log to console with appropriate method
   */
  private consoleLog(entry: ErrorLogEntry, level: LogLevel): void {
    const logData = {
      timestamp: entry.timestamp.toISOString(),
      error: entry.error.message,
      stack: entry.error.stack,
      context: entry.context,
    }

    switch (level) {
      case LogLevel.DEBUG:
        console.debug('[DEBUG]', logData)
        break
      case LogLevel.INFO:
        console.info('[INFO]', logData)
        break
      case LogLevel.WARN:
        console.warn('[WARN]', logData)
        break
      case LogLevel.ERROR:
        console.error('[ERROR]', logData)
        break
      case LogLevel.FATAL:
        console.error('[FATAL]', logData)
        break
    }
  }

  /**
   * Send error to external logging service (placeholder implementation)
   */
  private async sendToExternalService(entry: ErrorLogEntry): Promise<void> {
    try {
      // In a real application, this would send to services like:
      // - Sentry
      // - LogRocket
      // - Custom logging endpoint
      // - Analytics service

      // Placeholder implementation
      if (import.meta.env.DEV) {
        console.log('[External Service]', 'Would send error:', entry)
      }
    } catch (sendError) {
      console.error('Failed to send error to external service:', sendError)
    }
  }

  /**
   * Get recent error logs
   */
  getRecentLogs(limit: number = 50): ErrorLogEntry[] {
    return this.logs.slice(-limit)
  }

  /**
   * Get error statistics
   */
  getErrorStats(): {
    totalErrors: number
    errorsByType: Record<string, number>
    recentErrors: number
  } {
    const now = new Date()
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)

    const errorsByType: Record<string, number> = {}
    let recentErrors = 0

    for (const log of this.logs) {
      // Count by error type
      const errorType = log.error.constructor.name
      errorsByType[errorType] = (errorsByType[errorType] || 0) + 1

      // Count recent errors
      if (log.timestamp >= oneHourAgo) {
        recentErrors++
      }
    }

    return {
      totalErrors: this.logs.length,
      errorsByType,
      recentErrors,
    }
  }

  /**
   * Clear all logs
   */
  clearLogs(): void {
    this.logs = []
  }

  /**
   * Export logs as JSON
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2)
  }
}

// Singleton instance
const errorLogger = new ErrorLogger()

/**
 * Global error handler function
 */
export function handleError(error: Error, context?: any, level: LogLevel = LogLevel.ERROR): void {
  errorLogger.logError(error, context, level)
}

/**
 * Helper function for handling async errors
 */
export function handleAsyncError(promise: Promise<any>, context?: any): Promise<any> {
  return promise.catch((error) => {
    handleError(error, context)
    throw error // Re-throw to allow caller to handle
  })
}

/**
 * Wrapper for functions that might throw errors
 */
export function withErrorHandling<T extends any[], R>(
  fn: (...args: T) => R,
  context?: any,
): (...args: T) => R | undefined {
  return (...args: T): R | undefined => {
    try {
      return fn(...args)
    } catch (error) {
      handleError(error as Error, { ...context, args })
      return undefined
    }
  }
}

/**
 * Async wrapper for functions that might throw errors
 */
export function withAsyncErrorHandling<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  context?: any,
): (...args: T) => Promise<R | undefined> {
  return async (...args: T): Promise<R | undefined> => {
    try {
      return await fn(...args)
    } catch (error) {
      handleError(error as Error, { ...context, args })
      return undefined
    }
  }
}

/**
 * Get error logger instance for advanced usage
 */
export function getErrorLogger(): ErrorLogger {
  return errorLogger
}

/**
 * Helper to create user-friendly error messages
 */
export function createUserFriendlyMessage(error: Error): string {
  if (error instanceof MissionBrieflyError) {
    return error.message
  }

  // Generic error messages for common error types
  if (error.name === 'TypeError') {
    return 'An unexpected error occurred. Please try again.'
  }

  if (error.name === 'ReferenceError') {
    return 'A system error occurred. Please refresh the page and try again.'
  }

  if (error.name === 'NetworkError' || error.message.includes('fetch')) {
    return 'Network error. Please check your connection and try again.'
  }

  // Default friendly message
  return 'An unexpected error occurred. If this problem persists, please contact support.'
}

export { errorLogger }
