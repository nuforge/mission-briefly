import normalizeString from '@/utils/StringUtils'
import { MissionError, validateNonEmptyString, validateDate, validateMaxLength } from '@/errors'

export default class Mission {
  protected _id: string
  protected _title: string
  protected _objective: string
  protected _location?: string
  protected _date?: Date

  private generateId(name: string): string {
    try {
      return normalizeString(name)
    } catch (error) {
      throw new MissionError('Failed to generate mission ID', { name, error })
    }
  }

  constructor(title: string, objective: string, location?: string, date?: Date) {
    try {
      // Validate required fields
      validateNonEmptyString(title, 'Mission title')
      validateNonEmptyString(objective, 'Mission objective')
      validateMaxLength(title, 200, 'Mission title')
      validateMaxLength(objective, 1000, 'Mission objective')

      // Validate optional fields
      if (location !== undefined) {
        validateNonEmptyString(location, 'Mission location')
        validateMaxLength(location, 200, 'Mission location')
      }

      if (date !== undefined) {
        validateDate(date, 'Mission date')
      }

      this._title = title.trim()
      this._id = this.generateId(this._title)
      this._objective = objective.trim()
      this._location = location?.trim()
      this._date = date || new Date()
    } catch (error) {
      if (error instanceof MissionError) {
        throw error
      }
      const errorMessage = error instanceof Error ? error.message : String(error)
      throw new MissionError(`Failed to create mission: ${errorMessage}`, {
        title,
        objective,
        location,
        date,
      })
    }
  }

  /**
   * Override the mission ID (used for data loading from JSON)
   * This allows missions loaded from JSON to maintain their original IDs
   */
  overrideId(id: string): void {
    this.setId(id)
  }

  /**
   * Protected method to override ID (used for data migration/loading)
   */
  protected setId(id: string): void {
    try {
      validateNonEmptyString(id, 'Mission ID')
      validateMaxLength(id, 100, 'Mission ID')
      this._id = id
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      throw new MissionError(`Failed to set ID: ${errorMessage}`, { id })
    }
  }

  get id(): string {
    return this._id
  }

  get title(): string {
    return this._title
  }

  get objective(): string {
    return this._objective
  }

  get location(): string | undefined {
    return this._location
  }

  get date(): Date | undefined {
    return this._date
  }

  set title(title: string) {
    try {
      validateNonEmptyString(title, 'Mission title')
      validateMaxLength(title, 200, 'Mission title')
      this._title = title.trim()
      // Note: We don't regenerate ID when title changes to maintain consistency
    } catch (error) {
      if (error instanceof MissionError) {
        throw error
      }
      const errorMessage = error instanceof Error ? error.message : String(error)
      throw new MissionError(`Failed to set title: ${errorMessage}`, { title })
    }
  }

  set objective(objective: string) {
    try {
      validateNonEmptyString(objective, 'Mission objective')
      validateMaxLength(objective, 1000, 'Mission objective')
      this._objective = objective.trim()
    } catch (error) {
      if (error instanceof MissionError) {
        throw error
      }
      const errorMessage = error instanceof Error ? error.message : String(error)
      throw new MissionError(`Failed to set objective: ${errorMessage}`, { objective })
    }
  }

  set location(location: string | undefined) {
    try {
      if (location !== undefined) {
        validateNonEmptyString(location, 'Mission location')
        validateMaxLength(location, 200, 'Mission location')
        this._location = location.trim()
      } else {
        this._location = undefined
      }
    } catch (error) {
      if (error instanceof MissionError) {
        throw error
      }
      const errorMessage = error instanceof Error ? error.message : String(error)
      throw new MissionError(`Failed to set location: ${errorMessage}`, { location })
    }
  }

  set date(date: Date | undefined) {
    try {
      if (date !== undefined) {
        validateDate(date, 'Mission date')
      }
      this._date = date
    } catch (error) {
      if (error instanceof MissionError) {
        throw error
      }
      const errorMessage = error instanceof Error ? error.message : String(error)
      throw new MissionError(`Failed to set date: ${errorMessage}`, { date })
    }
  }

  setTitle(title: string): Mission {
    this.title = title // Use setter for validation
    return this
  }

  setObjective(objective: string): Mission {
    this.objective = objective // Use setter for validation
    return this
  }

  setLocation(location: string | undefined): Mission {
    this.location = location // Use setter for validation
    return this
  }

  setDate(date: Date | undefined): Mission {
    this.date = date // Use setter for validation
    return this
  }

  toJSON(): object {
    return {
      id: this._id,
      name: normalizeString(this._title),
      title: this._title,
      objective: this._objective,
      location: this._location,
      date: this._date,
    }
  }

  toString(): string {
    return JSON.stringify(this.toJSON())
  }
}
