import { ValidationError } from './MissionBrieflyError'

/**
 * Validation utility functions for input validation
 */

/**
 * Validates that a value is not null or undefined
 */
export function validateRequired<T>(value: T | null | undefined, fieldName: string): T {
  if (value === null || value === undefined) {
    throw new ValidationError(`${fieldName} is required`, fieldName, { value })
  }
  return value
}

/**
 * Validates that a string is not empty or whitespace only
 */
export function validateNonEmptyString(value: string, fieldName: string): string {
  validateRequired(value, fieldName)
  if (typeof value !== 'string') {
    throw new ValidationError(`${fieldName} must be a string`, fieldName, {
      value,
      type: typeof value,
    })
  }
  if (value.trim().length === 0) {
    throw new ValidationError(`${fieldName} cannot be empty`, fieldName, { value })
  }
  return value.trim()
}

/**
 * Validates that a string meets minimum length requirements
 */
export function validateMinLength(value: string, minLength: number, fieldName: string): string {
  validateNonEmptyString(value, fieldName)
  if (value.length < minLength) {
    throw new ValidationError(
      `${fieldName} must be at least ${minLength} characters long`,
      fieldName,
      { value, minLength, actualLength: value.length },
    )
  }
  return value
}

/**
 * Validates that a string doesn't exceed maximum length
 */
export function validateMaxLength(value: string, maxLength: number, fieldName: string): string {
  validateRequired(value, fieldName)
  if (value.length > maxLength) {
    throw new ValidationError(`${fieldName} must not exceed ${maxLength} characters`, fieldName, {
      value,
      maxLength,
      actualLength: value.length,
    })
  }
  return value
}

/**
 * Validates that a number is within a specific range
 */
export function validateNumberRange(
  value: number,
  min: number,
  max: number,
  fieldName: string,
): number {
  validateRequired(value, fieldName)
  if (typeof value !== 'number' || isNaN(value)) {
    throw new ValidationError(`${fieldName} must be a valid number`, fieldName, {
      value,
      type: typeof value,
    })
  }
  if (value < min || value > max) {
    throw new ValidationError(`${fieldName} must be between ${min} and ${max}`, fieldName, {
      value,
      min,
      max,
    })
  }
  return value
}

/**
 * Validates that a number is positive
 */
export function validatePositiveNumber(value: number, fieldName: string): number {
  validateRequired(value, fieldName)
  if (typeof value !== 'number' || isNaN(value)) {
    throw new ValidationError(`${fieldName} must be a valid number`, fieldName, {
      value,
      type: typeof value,
    })
  }
  if (value <= 0) {
    throw new ValidationError(`${fieldName} must be positive`, fieldName, { value })
  }
  return value
}

/**
 * Validates that an array is not empty
 */
export function validateNonEmptyArray<T>(value: T[], fieldName: string): T[] {
  validateRequired(value, fieldName)
  if (!Array.isArray(value)) {
    throw new ValidationError(`${fieldName} must be an array`, fieldName, {
      value,
      type: typeof value,
    })
  }
  if (value.length === 0) {
    throw new ValidationError(`${fieldName} cannot be empty`, fieldName, { value })
  }
  return value
}

/**
 * Validates that a value is one of the allowed options
 */
export function validateEnum<T>(value: T, allowedValues: T[], fieldName: string): T {
  validateRequired(value, fieldName)
  if (!allowedValues.includes(value)) {
    throw new ValidationError(
      `${fieldName} must be one of: ${allowedValues.join(', ')}`,
      fieldName,
      { value, allowedValues },
    )
  }
  return value
}

/**
 * Validates that a date is valid and not in the past (optional)
 */
export function validateDate(value: Date, fieldName: string, allowPast: boolean = true): Date {
  validateRequired(value, fieldName)
  if (!(value instanceof Date)) {
    throw new ValidationError(`${fieldName} must be a Date object`, fieldName, {
      value,
      type: typeof value,
    })
  }
  if (isNaN(value.getTime())) {
    throw new ValidationError(`${fieldName} must be a valid date`, fieldName, { value })
  }
  if (!allowPast && value < new Date()) {
    throw new ValidationError(`${fieldName} cannot be in the past`, fieldName, {
      value,
      now: new Date(),
    })
  }
  return value
}

/**
 * Validates an email address format (basic validation)
 */
export function validateEmail(value: string, fieldName: string): string {
  validateNonEmptyString(value, fieldName)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(value)) {
    throw new ValidationError(`${fieldName} must be a valid email address`, fieldName, { value })
  }
  return value
}

/**
 * Validates that an object has required properties
 */
export function validateObjectProperties<T extends Record<string, any>>(
  obj: T,
  requiredProps: (keyof T)[],
  objectName: string,
): T {
  validateRequired(obj, objectName)
  if (typeof obj !== 'object') {
    throw new ValidationError(`${objectName} must be an object`, objectName, {
      obj,
      type: typeof obj,
    })
  }

  for (const prop of requiredProps) {
    if (!(prop in obj) || obj[prop] === null || obj[prop] === undefined) {
      throw new ValidationError(`${objectName} must have property: ${String(prop)}`, String(prop), {
        obj,
        requiredProps,
      })
    }
  }
  return obj
}

/**
 * Safe validation wrapper that returns result with error
 */
export function safeValidate<T>(
  validationFn: () => T,
): { success: true; data: T } | { success: false; error: ValidationError } {
  try {
    const data = validationFn()
    return { success: true, data }
  } catch (error) {
    if (error instanceof ValidationError) {
      return { success: false, error }
    }
    // Re-throw non-validation errors
    throw error
  }
}
