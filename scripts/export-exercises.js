// สคริปต์นี้จะ generate SQL insert script สำหรับ exercises table
const { exerciseDatabase } = require('../lib/exercise-database.ts') 
const fs = require('fs')

function escape(str) {
  if (typeof str !== 'string') return str
  return str.replace(/'/g, "''")
}

const lines = []
lines.push('INSERT INTO exercises (user_id, name, category, muscle_groups, difficulty, equipment, description, instructions, image_url, estimated_duration, is_custom, created_at) VALUES')

exerciseDatabase.forEach((ex, idx) => {
  const userId = ex.userId ? `'${escape(ex.userId)}'` : 'NULL'
  const name = `'${escape(ex.name)}'`
  const category = `'${escape(ex.category)}'`
  const muscleGroups = `'${JSON.stringify(ex.muscleGroups)}'::jsonb`
  const difficulty = `'${escape(ex.difficulty)}'`
  const equipment = `'${escape(ex.equipment)}'`
  const description = `'${escape(ex.description)}'`
  const instructions = `'${JSON.stringify(ex.instructions)}'::jsonb`
  const image_url = `'${escape(ex.image_url)}'`
  const estimatedDuration = ex.estimatedDuration || 0
  const isCustom = ex.isCustom ? 'true' : 'false'
  const createdAt = ex.createdAt ? `'${escape(ex.createdAt)}'` : 'now()'

  lines.push(`  (${userId}, ${name}, ${category}, ${muscleGroups}, ${difficulty}, ${equipment}, ${description}, ${instructions}, ${image_url}, ${estimatedDuration}, ${isCustom}, ${createdAt})${idx === exerciseDatabase.length - 1 ? ';' : ','}`)
})

fs.writeFileSync('scripts/exercises.sql', lines.join('\n'))
console.log('Exported to scripts/exercises.sql') 