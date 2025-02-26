import Character from '@/game/character'
import galacticSpecies from '@/data/galacticSpecies'
import {
  klingonRanks,
  bajoranRanks,
  cardassianRanks,
  starfleetRanks,
} from '@/data/affiliationRanks'
import starfleetDepartments from '@/data/affiliationDepartments'

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
    starfleetDepartments['medical'],
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

export { TNGCharacters, DS9Characters }
