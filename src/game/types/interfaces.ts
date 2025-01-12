export interface Character {
  name: string
  species: string
  rank: Rank
}

export interface Rank {
  name: string
  title: string
  pips: number
}

export interface Mission {
  title: string
  objective: string
  location: string
  date: string
  logs: Log[]
}

export interface Log {
  characters: Character[]
  title: string
  summary: string
  development: string
  values: string
  careerEvents: string
}

export interface Starship {
  name: string
  registry: string
  class: string
  crew: Character[]
}
