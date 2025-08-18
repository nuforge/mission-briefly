import Department from '@/game/department'

const starfleetDepartments = {
  command: new Department('Command', 'red-darken-2', 'mdi-account-multiple'),
  operations: new Department('Operations', 'yellow-darken-2', 'mdi-cog'),
  science: new Department('Science', 'blue-darken-2', 'mdi-flask'),
  medical: new Department('Medical', 'teal-darken-2', 'mdi-heart-pulse'),
  security: new Department('Security', 'warning', 'mdi-security'),
  engineering: new Department('Engineering', 'yellow-darken-2', 'mdi-tools'),
}

export default starfleetDepartments
