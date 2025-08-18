import normalizeString from '@/utils/StringUtils'
import {
  MissionBrieflyError,
  validateNonEmptyString,
  validateRequired,
  validateMaxLength,
} from '@/errors'

export class EntityError extends MissionBrieflyError {
  constructor(message: string, context?: any) {
    super(message, 'EntityError', context)
  }
}

export default class Entity {
  protected _id: string
  protected _name: string
  protected _type: string
  protected _origin: object | string | number | boolean

  private generateId(name: string): string {
    try {
      validateNonEmptyString(name, 'Entity name for ID generation')
      return normalizeString(name)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      throw new EntityError(`Failed to generate ID: ${errorMessage}`, { name })
    }
  }

  constructor(name: string, type?: string, origin?: object) {
    try {
      validateNonEmptyString(name, 'Entity name')
      validateMaxLength(name, 100, 'Entity name')

      if (type) {
        validateNonEmptyString(type, 'Entity type')
        validateMaxLength(type, 50, 'Entity type')
      }

      this._name = name
      this._id = this.generateId(this._name)
      this._type = type || this.constructor.name
      this._origin = origin || true
    } catch (error) {
      if (error instanceof EntityError) {
        throw error
      }
      const errorMessage = error instanceof Error ? error.message : String(error)
      throw new EntityError(`Failed to create entity: ${errorMessage}`, { name, type, origin })
    }
    return this
  }

  get id(): string {
    return this._id
  }

  get name(): string {
    return this._name
  }

  get type(): string {
    return this._type
  }

  get origin(): object | string | number | boolean {
    return this._origin
  }

  /**
   * Protected method to override ID (used for data migration/loading)
   * Only intended for use when loading data from external sources
   */
  protected setId(id: string): void {
    try {
      validateNonEmptyString(id, 'Entity ID')
      validateMaxLength(id, 100, 'Entity ID')
      this._id = id
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      throw new EntityError(`Failed to set ID: ${errorMessage}`, { id })
    }
  }

  set name(name: string) {
    try {
      validateNonEmptyString(name, 'Entity name')
      validateMaxLength(name, 100, 'Entity name')

      this._name = name
      this._id = this.generateId(this._name) // Regenerate ID when name changes
    } catch (error) {
      if (error instanceof EntityError) {
        throw error
      }
      const errorMessage = error instanceof Error ? error.message : String(error)
      throw new EntityError(`Failed to set name: ${errorMessage}`, { name })
    }
  }

  set type(type: string) {
    try {
      validateNonEmptyString(type, 'Entity type')
      validateMaxLength(type, 50, 'Entity type')

      this._type = type
    } catch (error) {
      if (error instanceof EntityError) {
        throw error
      }
      const errorMessage = error instanceof Error ? error.message : String(error)
      throw new EntityError(`Failed to set type: ${errorMessage}`, { type })
    }
  }

  set origin(origin: object) {
    try {
      validateRequired(origin, 'Entity origin')

      this._origin = origin
    } catch (error) {
      if (error instanceof EntityError) {
        throw error
      }
      const errorMessage = error instanceof Error ? error.message : String(error)
      throw new EntityError(`Failed to set origin: ${errorMessage}`, { origin })
    }
  }

  newName(name: string): Entity {
    try {
      this.name = name
      return this
    } catch (error) {
      if (error instanceof EntityError) {
        throw error
      }
      const errorMessage = error instanceof Error ? error.message : String(error)
      throw new EntityError(`Failed to set new name: ${errorMessage}`, { name })
    }
  }

  newType(type: string): Entity {
    try {
      this.type = type
      return this
    } catch (error) {
      if (error instanceof EntityError) {
        throw error
      }
      const errorMessage = error instanceof Error ? error.message : String(error)
      throw new EntityError(`Failed to set new type: ${errorMessage}`, { type })
    }
  }

  newOrigin(origin: object): Entity {
    try {
      this.origin = origin
      return this
    } catch (error) {
      if (error instanceof EntityError) {
        throw error
      }
      const errorMessage = error instanceof Error ? error.message : String(error)
      throw new EntityError(`Failed to set new origin: ${errorMessage}`, { origin })
    }
  }

  static fromEntity(entity: Entity): Entity {
    try {
      validateRequired(entity, 'Source entity')

      if (!(entity instanceof Entity)) {
        throw new EntityError('Source must be an Entity instance')
      }

      return new Entity(entity.name, entity.type, entity)
    } catch (error) {
      if (error instanceof EntityError) {
        throw error
      }
      const errorMessage = error instanceof Error ? error.message : String(error)
      throw new EntityError(`Failed to create entity from source: ${errorMessage}`, {
        source: entity?.name,
      })
    }
  }

  static fromEntities(entities: Entity[]): Entity[] {
    try {
      validateRequired(entities, 'Entities array')

      if (!Array.isArray(entities)) {
        throw new EntityError('Input must be an array')
      }

      entities.forEach((entity, index) => {
        if (!(entity instanceof Entity)) {
          throw new EntityError(`Entity at index ${index} must be an Entity instance`)
        }
      })

      return entities.map((entity) => Entity.fromEntity(entity))
    } catch (error) {
      if (error instanceof EntityError) {
        throw error
      }
      const errorMessage = error instanceof Error ? error.message : String(error)
      throw new EntityError(`Failed to create entities from array: ${errorMessage}`, {
        count: entities?.length,
      })
    }
  }

  static nString(str: string): string {
    try {
      validateNonEmptyString(str, 'String to normalize')
      return normalizeString(str)
    } catch (error) {
      if (error instanceof EntityError) {
        throw error
      }
      const errorMessage = error instanceof Error ? error.message : String(error)
      throw new EntityError(`Failed to normalize string: ${errorMessage}`, { str })
    }
  }

  toJSON(): object {
    try {
      return {
        id: this._id,
        name: this._name,
        type: this._type,
        origin: this._origin,
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      throw new EntityError(`Failed to serialize entity to JSON: ${errorMessage}`)
    }
  }
}
