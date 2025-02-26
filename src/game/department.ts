export default class Department {
  private _name: string
  private _color: string
  private _icon: string

  constructor(name: string, color: string, icon: string) {
    this._name = name
    this._color = color
    this._icon = icon
    return this
  }

  get name(): string {
    return this._name
  }

  set name(name: string) {
    this._name = name
  }

  get color(): string {
    return this._color
  }

  set color(color: string) {
    this._color = color
  }

  get icon(): string {
    return this._icon
  }

  set icon(icon: string) {
    this._icon = icon
  }

  public getName(): string {
    return this._name
  }

  toJSON(): object {
    return {
      name: this._name,
      color: this._color,
      icon: this._icon,
    }
  }
}
