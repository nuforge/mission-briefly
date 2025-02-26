import Ship from '@/game/ship'
import starshipRoles from '@/data/starshipRoles'
import { TNGCharacters, DS9Characters } from '@/data/heroCharacters'

const HeroStarship: { [key: string]: Ship } = {
  Enterprise: new Ship('USS Enterprise', 'Galaxy-class', 'NCC-1701-D')
    .setCrew(Object.values(TNGCharacters))
    .assignCrew(TNGCharacters['Jean-Luc Picard'], starshipRoles['captain'])
    .assignCrew(TNGCharacters['William Riker'], starshipRoles['firstOfficer']),
  EnterpriseE: new Ship('USS Enterprise E', 'Sovereign-class', 'NCC-1701-E').setCrew(
    Object.values(TNGCharacters),
  ),
  Defiant: new Ship('USS Defiant', 'Defiant-class', 'NX-74205').setCrew(
    Object.values(DS9Characters),
  ),
  Voyager: new Ship('USS Voyager', 'Intrepid-class', 'NCC-74656'),
}

export default HeroStarship
