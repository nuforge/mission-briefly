import Mission from '@/game/mission'
import Log from '@/game/log'

import farpointMission from '@/data/missions/encounterAtFarpoint'
import repairMission from '@/data/missions/repairCommsArray'
import missionLog from '@/data/missionLogs'

const Missions: Mission[] = [farpointMission, repairMission]
const LogEntries: Log[] = [new Log(missionLog)]

export { LogEntries, Missions }
