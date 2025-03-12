import normalizeString from '@/utils/StringUtils'

export default class Mission {
  protected _id: string
  protected _title: string
  protected _objective: string
  protected _location?: string
  protected _date?: Date

  private generateId(name: string): string {
    return normalizeString(name)
  }

  constructor(title: string, objective: string, location?: string, date?: Date) {
    this._title = title
    this._id = this.generateId(this._title)
    this._objective = objective
    this._location = location
    this._date = date || new Date()
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
    this._title = title
  }

  set objective(objective: string) {
    this._objective = objective
  }

  set location(location: string) {
    this._location = location
  }

  set date(date: Date) {
    this._date = date
  }

  setTitle(title: string): Mission {
    this._title = title
    return this
  }

  setObjective(objective: string): Mission {
    this._objective = objective
    return this
  }

  setLocation(location: string): Mission {
    this._location = location
    return this
  }

  setDate(date: Date): Mission {
    this._date = date
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
