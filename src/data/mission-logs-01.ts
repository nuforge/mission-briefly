import Character from '@/game/character'
import Species from '@/game/species'
import Department from '@/game/department'
import Rank from '@/game/rank'
import Mission from '@/game/mission'
import Ship from '@/game/ship'
import Log from '@/game/log'

const galacticSpecies = {
  Human: new Species('Human'),
  Android: new Species('Android'),
  Betazoid: new Species('Betazoid'),
  Klingon: new Species('Klingon'),
  Bajoran: new Species('Bajoran'),
  Cardassian: new Species('Cardassian'),
  Trill: new Species('Trill'),
  Ferengi: new Species('Ferengi'),
  'El-Aurian': new Species('El-Aurian'),
  Vorta: new Species('Vorta'),
  Lurian: new Species('Lurian'),
}

const klingonRanks = {
  General: new Rank('General', 'General', 5),
  Chancellor: new Rank('Chancellor', 'Chancellor', 5),
}

const bajoranRanks = {
  Kai: new Rank('Kai', 'Kai', 0),
  Major: new Rank('Major', 'Major', 3),
}

const cardassianRanks = {
  Gul: new Rank('Gul', 'Gul', 3),
  Legate: new Rank('Legate', 'Legate', 4),
}

const starfleetRanks = {
  Civilian: new Rank('Civilian', 'Civ', 0),
  Ensign: new Rank('Ensign', 'Ens', 1),
  ChiefPettyOfficer: new Rank('Chief Petty Officer', 'CPO', 1),
  Lieutenant: new Rank('Lieutenant', 'Lt', 2),
  LieutenantCommander: new Rank('Lieutenant Commander', 'LtCmdr', 1.5),
  Commander: new Rank('Commander', 'Cmdr', 3),
  Captain: new Rank('Captain', 'Captain', 4),
  Admiral: new Rank('Admiral', 'Admiral', 6),
}

const starfleetDepartments = {
  command: new Department('Command', 'red-darken-2', 'mdi-account-multiple'),
  operations: new Department('Operations', 'yellow-darken-2', 'mdi-cog'),
  science: new Department('Science', 'blue-darken-2', 'mdi-atom'),
  medical: new Department('Medical', 'teal-darken-2', 'mdi-plus-thick'),
  security: new Department('Security', 'red-darken-2', 'mdi-shield'),
  engineering: new Department('Engineering', 'yellow-darken-2', 'mdi-wrench'),
}

const TNGCharacters: { [key: string]: Character } = {
  'Jean-Luc Picard': new Character(
    'Jean-Luc Picard',
    galacticSpecies['Human'],
    starfleetRanks['Captain'],
    starfleetDepartments['command'],
  ),
  'William Riker': new Character(
    'William Riker',
    galacticSpecies['Human'],
    starfleetRanks['Commander'],
    starfleetDepartments['command'],
  ),
  'Beverly Crusher': new Character(
    'Beverly Crusher',
    galacticSpecies['Human'],
    starfleetRanks['Commander'],
    starfleetDepartments['medical'],
  ),
  'Katherine Pulaski': new Character(
    'Katherine Pulaski',
    galacticSpecies['Human'],
    starfleetRanks['Commander'],
    starfleetDepartments['command'],
  ),
  Data: new Character(
    'Data',
    galacticSpecies['Android'],
    starfleetRanks['LieutenantCommander'],
    starfleetDepartments['operations'],
  ),
  'Geordi La Forge': new Character(
    'Geordi La Forge',
    galacticSpecies['Human'],
    starfleetRanks['LieutenantCommander'],
    starfleetDepartments['engineering'],
  ),
  'Deanna Troi': new Character(
    'Deanna Troi',
    galacticSpecies['Betazoid'],
    starfleetRanks['LieutenantCommander'],
    starfleetDepartments['science'],
  ),
  Worf: new Character(
    'Worf',
    galacticSpecies['Klingon'],
    starfleetRanks['Lieutenant'],
    starfleetDepartments['security'],
  ),
  'Tasha Yar': new Character(
    'Tasha Yar',
    galacticSpecies['Human'],
    starfleetRanks['Lieutenant'],
    starfleetDepartments['security'],
  ),
  'Wesley Crusher': new Character(
    'Wesley Crusher',
    galacticSpecies['Human'],
    starfleetRanks['Ensign'],
  ),
  Guinan: new Character('Guinan', galacticSpecies['El-Aurian'], starfleetRanks['Civilian']),
}

const DS9Characters: { [key: string]: Character } = {
  'Benjamin Sisko': new Character(
    'Benjamin Sisko',
    galacticSpecies['Human'],
    starfleetRanks['Captain'],
  ),
  'Kira Nerys': new Character('Kira Nerys', galacticSpecies['Bajoran'], bajoranRanks['Major']),
  'Jadzia Dax': new Character(
    'Jadzia Dax',
    galacticSpecies['Trill'],
    starfleetRanks['LieutenantCommander'],
  ),
  'Julian Bashir': new Character(
    'Julian Bashir',
    galacticSpecies['Human'],
    starfleetRanks['Lieutenant'],
  ),
  "Miles O'Brien": new Character(
    "Miles O'Brien",
    galacticSpecies['Human'],
    starfleetRanks['ChiefPettyOfficer'],
  ),
  Quark: new Character('Quark', galacticSpecies['Ferengi'], starfleetRanks['Civilian']),
  Garak: new Character('Garak', galacticSpecies['Cardassian'], starfleetRanks['Civilian']),
  Weyoun: new Character('Weyoun', galacticSpecies['Vorta'], starfleetRanks['Civilian']),
  Martok: new Character('Martok', galacticSpecies['Klingon'], klingonRanks['General']),
  Gowron: new Character('Gowron', galacticSpecies['Klingon'], klingonRanks['Chancellor']),
  Dukat: new Character('Dukat', galacticSpecies['Cardassian'], cardassianRanks['Gul']),
  'Winn Adami': new Character('Winn Adami', galacticSpecies['Bajoran'], bajoranRanks['Kai']),
  'Legate Damar': new Character(
    'Legate Damar',
    galacticSpecies['Cardassian'],
    cardassianRanks['Legate'],
  ),
  'Kasidy Yates': new Character(
    'Kasidy Yates',
    galacticSpecies['Human'],
    starfleetRanks['Civilian'],
  ),
  'Jake Sisko': new Character('Jake Sisko', galacticSpecies['Human'], starfleetRanks['Civilian']),
  Nog: new Character('Nog', galacticSpecies['Ferengi'], starfleetRanks['Ensign']),
  Rom: new Character('Rom', galacticSpecies['Ferengi'], starfleetRanks['Civilian']),
  Leeta: new Character('Leeta', galacticSpecies['Bajoran'], starfleetRanks['Civilian']),
  Morn: new Character('Morn', galacticSpecies['Lurian'], starfleetRanks['Civilian']),
  "Keiko O'Brien": new Character(
    "Keiko O'Brien",
    galacticSpecies['Human'],
    starfleetRanks['Civilian'],
  ),
  'Admiral Ross': new Character(
    'Admiral Ross',
    galacticSpecies['Human'],
    starfleetRanks['Admiral'],
  ),
}

const HeroShip: { [key: string]: Ship } = {
  EnterpriseE: new Ship('USS Enterprise E', 'Sovereign-class', 'NCC-1701-E').setCrew(
    Object.values(TNGCharacters),
  ),
  Enterprise: new Ship('USS Enterprise', 'Galaxy-class', 'NCC-1701-D').setCrew(
    Object.values(TNGCharacters),
  ),
  Defiant: new Ship('USS Defiant', 'Defiant-class', 'NX-74205').setCrew(
    Object.values(DS9Characters),
  ),
  Voyager: new Ship('USS Voyager', 'Intrepid-class', 'NCC-74656'),
  Excelsior: new Ship('USS Excelsior', 'Excelsior-class'),
  Reliant: new Ship('USS Reliant', 'Miranda-class'),
  Stargazer: new Ship('USS Stargazer', 'Constellation-class'),
}

const captainsLog = {
  title: 'Encounter at Farpoint',
  summary: 'The crew of the USS Enterprise-D is en route to Farpoint Station on Deneb IV.',
  development: 'The crew is getting to know each other and their new captain.',
  values: 'The crew is learning to work together as a team.',
  careerEvents: 'The crew is investigating the mysterious Farpoint Station.',
  character: Object.values(TNGCharacters),
}

const mission = new Mission(
  'Encounter at Farpoint',
  'Make contact with the administration at Far Point Stations.',
  'Deneb IV',
  new Date('2364-01-01'),
)

const Missions: Mission[] = [mission]
const LogEntries: Log[] = [new Log(captainsLog)]

export { TNGCharacters, DS9Characters, HeroShip, LogEntries, Missions, starfleetDepartments }
