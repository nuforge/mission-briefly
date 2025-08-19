import Entity from './entity'

/**
 * Represents 2D coordinates in space
 */
export interface Coordinates {
  x: number
  y: number
}

/**
 * Represents 3D coordinates in space
 */
export interface Coordinates3D extends Coordinates {
  z: number
}

/**
 * Utility class for coordinate calculations and transformations
 */
export class CoordinateUtils {
  /**
   * Calculate distance between two 2D points
   */
  static distance2D(point1: Coordinates, point2: Coordinates): number {
    const dx = point2.x - point1.x
    const dy = point2.y - point1.y
    return Math.sqrt(dx * dx + dy * dy)
  }

  /**
   * Calculate distance between two 3D points
   */
  static distance3D(point1: Coordinates3D, point2: Coordinates3D): number {
    const dx = point2.x - point1.x
    const dy = point2.y - point1.y
    const dz = point2.z - point1.z
    return Math.sqrt(dx * dx + dy * dy + dz * dz)
  }

  /**
   * Convert 3D coordinates to 2D map projection
   */
  static projectTo2D(point: Coordinates3D, scale: number = 1): Coordinates {
    return {
      x: point.x * scale,
      y: point.y * scale,
    }
  }

  /**
   * Check if point is within bounds
   */
  static isInBounds(point: Coordinates, bounds: { width: number; height: number }): boolean {
    return point.x >= 0 && point.x <= bounds.width && point.y >= 0 && point.y <= bounds.height
  }

  /**
   * Calculate angle between two points in radians
   */
  static angle(from: Coordinates, to: Coordinates): number {
    return Math.atan2(to.y - from.y, to.x - from.x)
  }

  /**
   * Move a point towards another point by a given distance
   */
  static moveTowards(from: Coordinates, to: Coordinates, distance: number): Coordinates {
    const angle = this.angle(from, to)
    return {
      x: from.x + Math.cos(angle) * distance,
      y: from.y + Math.sin(angle) * distance,
    }
  }
}
