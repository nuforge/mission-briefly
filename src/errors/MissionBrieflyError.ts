/**
 * Custom error classes for the Mission Briefly application
 */

/**
 * Base error class for all Mission Briefly errors
 */
export class MissionBrieflyError extends Error {
  public readonly code: string
  public readonly context?: any

  constructor(message: string, code: string, context?: any) {
    super(message)
    this.name = this.constructor.name
    this.code = code
    this.context = context

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if ((Error as any).captureStackTrace) {
      ;(Error as any).captureStackTrace(this, this.constructor)
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      context: this.context,
      stack: this.stack,
    }
  }
}

/**
 * Validation errors for invalid input data
 */
export class ValidationError extends MissionBrieflyError {
  public readonly field?: string

  constructor(message: string, field?: string, context?: any) {
    super(message, 'VALIDATION_ERROR', context)
    this.field = field
  }
}

/**
 * Errors related to character operations
 */
export class CharacterError extends MissionBrieflyError {
  constructor(message: string, context?: any) {
    super(message, 'CHARACTER_ERROR', context)
  }
}

/**
 * Errors related to ship operations
 */
export class ShipError extends MissionBrieflyError {
  constructor(message: string, context?: any) {
    super(message, 'SHIP_ERROR', context)
  }
}

/**
 * Errors related to mission operations
 */
export class MissionError extends MissionBrieflyError {
  constructor(message: string, context?: any) {
    super(message, 'MISSION_ERROR', context)
  }
}

/**
 * Errors related to data operations
 */
export class DataError extends MissionBrieflyError {
  constructor(message: string, context?: any) {
    super(message, 'DATA_ERROR', context)
  }
}

/**
 * Errors related to application state
 */
export class StateError extends MissionBrieflyError {
  constructor(message: string, context?: any) {
    super(message, 'STATE_ERROR', context)
  }
}

/**
 * Network and API related errors
 */
export class NetworkError extends MissionBrieflyError {
  public readonly status?: number
  public readonly url?: string

  constructor(message: string, status?: number, url?: string, context?: any) {
    super(message, 'NETWORK_ERROR', context)
    this.status = status
    this.url = url
  }
}

/**
 * Configuration and setup errors
 */
export class ConfigurationError extends MissionBrieflyError {
  constructor(message: string, context?: any) {
    super(message, 'CONFIGURATION_ERROR', context)
  }
}
