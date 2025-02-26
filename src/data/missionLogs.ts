import { TNGCharacters } from '@/data/heroCharacters'

const missionLog = {
  title: 'Encounter at Farpoint',
  type: `Captain's Log`,
  summary: 'The crew of the USS Enterprise-D is en route to Farpoint Station on Deneb IV.',
  development: 'The crew is getting to know each other and their new captain.',
  values: 'The crew is learning to work together as a team.',
  careerEvents: 'The crew is investigating the mysterious Farpoint Station.',
  character: Object.values(TNGCharacters),
}

export default missionLog
