import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.NETLIFY_DATABASE_URL })

// GET: ดึง exercises ทั้งหมด (system + custom ของ user)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userEmail = searchParams.get('user')
  let userId = null
  if (userEmail) {
    const userRes = await pool.query('SELECT id FROM users WHERE email=$1', [userEmail])
    if (userRes.rows[0]) userId = userRes.rows[0].id
  }
  // system exercises (user_id IS NULL) + custom ของ user
  const result = await pool.query('SELECT * FROM exercises WHERE user_id IS NULL OR user_id=$1 ORDER BY created_at DESC', [userId])
  return NextResponse.json({ exercises: result.rows })
}

// POST: เพิ่ม exercise ใหม่ (custom)
export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    let userId = null
    if (data.userEmail) {
      const userRes = await pool.query('SELECT id FROM users WHERE email=$1', [data.userEmail])
      if (userRes.rows[0]) userId = userRes.rows[0].id
    }
    const res = await pool.query(
      `INSERT INTO exercises (user_id, name, category, muscle_groups, difficulty, equipment, description, instructions, image_url, estimated_duration, is_custom, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [
        userId,
        data.name,
        data.category,
        JSON.stringify(data.muscleGroups),
        data.difficulty,
        data.equipment,
        data.description,
        JSON.stringify(data.instructions),
        data.image_url,
        data.estimatedDuration,
        true,
        data.createdAt,
      ]
    )
    return NextResponse.json({ exercise: res.rows[0] })
  } catch (error) {
    console.error('Error creating exercise:', error)
    return NextResponse.json({ error: 'Failed to create exercise' }, { status: 500 })
  }
}

// PUT: แก้ไข exercise (custom เท่านั้น, ต้องส่ง id)
export async function PUT(req: NextRequest) {
  const data = await req.json()
  const res = await pool.query(
    `UPDATE exercises SET
      name=$2, category=$3, muscle_groups=$4, difficulty=$5, equipment=$6, description=$7, instructions=$8, image_url=$9, estimated_duration=$10, created_at=$11
     WHERE id=$1
     RETURNING *`,
    [
      data.id,
      data.name,
      data.category,
      JSON.stringify(data.muscleGroups),
      data.difficulty,
      data.equipment,
      data.description,
      JSON.stringify(data.instructions),
      data.image_url,
      data.estimatedDuration,
      data.createdAt,
    ]
  )
  return NextResponse.json({ exercise: res.rows[0] })
}

// DELETE: ลบ exercise (custom เท่านั้น, ต้องส่ง id)
export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  await pool.query('DELETE FROM exercises WHERE id=$1', [id])
  return NextResponse.json({ success: true })
} 