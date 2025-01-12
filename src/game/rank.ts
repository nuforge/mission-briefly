export default class Rank {
  protected _name: string
  protected _title: string
  protected _value: number = 0 // Change from _pips to _value
  protected _class?: string = 'rounded-circle'

  constructor(name: string, title: string, value: number, className?: string) {
    this._name = name
    this._title = title
    this.setValue(value)
    this._class = className || this._class
  }

  get name(): string {
    return this._name
  }

  get title(): string {
    return this._title
  }

  get value(): number {
    return this._value
  }

  get class(): string | undefined {
    return this._class
  }

  set name(name: string) {
    this._name = name
  }

  set title(title: string) {
    this._title = title
  }

  set value(value: number) {
    this.setValue(value)
  }

  set class(className: string) {
    this._class = className
  }

  setName(name: string): Rank {
    this._name = name
    return this
  }

  setTitle(title: string): Rank {
    this._title = title
    return this
  }

  getPips(): Array<boolean> {
    const pips = Math.floor(this._value)
    const hasHalfPip = this._value % 1 !== 0
    const pipArray = Array(pips).fill(true)
    if (hasHalfPip) {
      pipArray.push(false)
    }
    return pipArray
  }

  setValue(value: number): Rank {
    if (value < 0) {
      throw new RangeError('Value must be a non-negative number')
    }
    this._value = value
    return this
  }

  setClass(className: string): Rank {
    this._class = className
    return this
  }

  toJSON(): object {
    return {
      name: this._name,
      title: this._title,
      value: this._value,
      class: this._class,
    }
  }

  toString(): string {
    return JSON.stringify(this.toJSON())
  }
}
