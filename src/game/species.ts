export default class Species {
  protected _name: string
  protected _type: string
  protected _origin: object | string | number | boolean

  constructor(name: string, type?: string, origin?: object) {
    this._name = name
    this._type = type || this.constructor.name
    this._origin = origin || true
    return this
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

  set name(name: string) {
    this._name = name
  }

  set type(type: string) {
    this._type = type
  }

  set origin(origin: object) {
    this._origin = origin
  }

  newName(name: string): Species {
    this.name = name
    return this
  }

  newType(type: string): Species {
    this.type = type
    return this
  }

  newOrigin(origin: object): Species {
    this.origin = origin
    return this
  }

  static fromSpecies(species: Species): Species {
    return new Species(species.name)
  }

  toJSON(): object {
    return {
      name: this._name,
      type: this._type,
      origin: this._origin,
    }
  }
}
