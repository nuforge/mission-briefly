import Role from '@/game/role'

const starshipRoles = {
  captain: new Role('Captain', 'Captain', 'mdi-account-circle'),
  firstOfficer: new Role('First Officer', 'First Officer', 'mdi-account'),
  chiefMedicalOfficer: new Role('Chief Medical Officer', 'Chief Medical Officer', 'mdi-account'),
  chiefEngineer: new Role('Chief Engineer', 'Chief Engineer', 'mdi-account'),
  chiefScienceOfficer: new Role('Chief Science Officer', 'Chief Science Officer', 'mdi-account'),
  chiefOfSecurity: new Role('Chief of Security', 'Chief of Security', 'mdi-account'),
  helmsman: new Role('Helmsman', 'Helmsman', 'mdi-account'),
  tacticalOfficer: new Role('Tactical Officer', 'Tactical Officer', 'mdi-account'),
  operationsOfficer: new Role('Operations Officer', 'Operations Officer', 'mdi-account'),
  connOfficer: new Role('Conn Officer', 'Conn Officer', 'mdi-account'),
  transporterChief: new Role('Transporter Chief', 'Transporter Chief', 'mdi-account'),
  counselor: new Role('Counselor', 'Counselor', 'mdi-account'),
}

export default starshipRoles
