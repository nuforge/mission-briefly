import Rank from '@/game/rank'

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
  LieutenantJG: new Rank('Lieutenant (Junior Grade)', 'LtJG', 1.5),
  Lieutenant: new Rank('Lieutenant', 'Lt', 2),
  LieutenantCommander: new Rank('Lieutenant Commander', 'LtCmdr', 2.5),
  Commander: new Rank('Commander', 'Cmdr', 3),
  Captain: new Rank('Captain', 'Captain', 4),
  Admiral: new Rank('Admiral', 'Admiral', 6),
}

export { klingonRanks, bajoranRanks, cardassianRanks, starfleetRanks }
