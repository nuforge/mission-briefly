export default class Role {
  protected _name: string
  protected _icon?: string
  protected _color?: string

  constructor(name: string, icon?: string, color?: string) {
    this._name = name
    this._icon = icon
    this._color = color

    return this
  }

  get name(): string {
    return this._name
  }

  get icon(): string | undefined {
    return this._icon
  }

  get color(): string | undefined {
    return this._color
  }

  set name(name: string) {
    this._name = name
  }

  set icon(icon: string | undefined) {
    this._icon = icon
  }

  set color(color: string | undefined) {
    this._color = color
  }

  setName(name: string): Role {
    this._name = name
    return this
  }

  setIcon(icon: string): Role {
    this._icon = icon
    return this
  }

  setColor(color: string): Role {
    this._color = color
    return this
  }

  toJSON(): object {
    return {
      name: this._name,
      icon: this._icon,
      color: this._color,
    }
  }
}
