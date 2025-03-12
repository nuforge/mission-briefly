import normalizeString from '@/utils/StringUtils'

export default class Entity {
  protected _id: string
  protected _name: string
  protected _type: string
  protected _origin: object | string | number | boolean

  private generateId(name: string): string {
    return normalizeString(name)
  }

  constructor(name: string, type?: string, origin?: object) {
    this._name = name
    this._id = this.generateId(this._name)
    this._type = type || this.constructor.name
    this._origin = origin || true
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

  set name(name: string) {
    this._name = name
  }

  set type(type: string) {
    this._type = type
  }

  set origin(origin: object) {
    this._origin = origin
  }

  newName(name: string): Entity {
    this.name = name
    return this
  }
  newType(type: string): Entity {
    this.type = type
    return this
  }
  newOrigin(origin: object): Entity {
    this.origin = origin
    return this
  }

  static fromEntity(entity: Entity): Entity {
    return new Entity(entity.name, entity.type, entity)
  }

  static fromEntities(entities: Entity[]): Entity[] {
    return entities.map((entity) => Entity.fromEntity(entity))
  }

  static nString(str: string): string {
    return normalizeString(str)
  }

  toJSON(): object {
    return {
      id: this._id,
      name: this._name,
      type: this._type,
      origin: this._origin,
    }
  }
}
