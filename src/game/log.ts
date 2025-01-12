import Character from './character'
import Mission from './mission'

interface MissionLog {
  title: string
  summary: string
  development: string
  values: string
  careerEvents: string
  character: Character[]
}
export default class Log {
  protected _title: string
  protected _summary: string
  protected _development: string
  protected _values: string
  protected _careerEvents: string
  protected _mission?: Mission[]
  protected _character: Character[]

  constructor(missionLog: MissionLog) {
    this._title = missionLog.title
    this._summary = missionLog.summary
    this._development = missionLog.development
    this._values = missionLog.values
    this._careerEvents = missionLog.careerEvents
    this._character = missionLog.character
  }

  get character(): Character[] {
    return this._character
  }

  get title(): string {
    return this._title
  }

  get summary(): string {
    return this._summary
  }

  get development(): string {
    return this._development
  }

  get values(): string {
    return this._values
  }

  get careerEvents(): string {
    return this._careerEvents
  }
  set character(character: Character) {
    this._character = [character]
  }

  set characters(character: Character[]) {
    this._character = character
  }

  set title(title: string) {
    this._title = title
  }

  set summary(summary: string) {
    this._summary = summary
  }

  set development(development: string) {
    this._development = development
  }

  set values(values: string) {
    this._values = values
  }

  set careerEvents(careerEvents: string) {
    this._careerEvents = careerEvents
  }

  setTitle(title: string): Log {
    this._title = title
    return this
  }

  setSummary(summary: string): Log {
    this._summary = summary
    return this
  }

  setDevelopment(development: string): Log {
    this._development = development
    return this
  }

  setValues(values: string): Log {
    this._values = values
    return this
  }

  setCareerEvents(careerEvents: string): Log {
    this._careerEvents = careerEvents
    return this
  }

  toJSON(): object {
    return {
      character: this._character,
      title: this._title,
      summary: this._summary,
      development: this._development,
      values: this._values,
      careerEvents: this._careerEvents,
    }
  }

  toString(): string {
    return `${this._title} - ${this._summary}`
  }
}
