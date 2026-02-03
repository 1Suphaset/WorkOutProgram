import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import { pool } from "@/lib/db"


// GET: ดึง templates ทั้งหมดของ user
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userEmail = searchParams.get('user')
  if (!userEmail) return NextResponse.json({ error: 'Missing user' }, { status: 400 })

  const userRes = await pool.query('SELECT id FROM users WHERE email=$1', [userEmail])
  if (!userRes.rows[0]) return NextResponse.json({ templates: [] })
  const userId = userRes.rows[0].id

  const result = await pool.query('SELECT * FROM templates WHERE user_id=$1 ORDER BY created_at DESC', [userId])
  return NextResponse.json({ templates: result.rows })
}

// POST: เพิ่ม template ใหม่
export async function POST(req: NextRequest) {
  const data = await req.json()
  const userRes = await pool.query('SELECT id FROM users WHERE email=$1', [data.userEmail])
  if (!userRes.rows[0]) return NextResponse.json({ error: 'User not found' }, { status: 400 })
  const userId = userRes.rows[0].id

  // Validation: ตรวจสอบ exerciseId ทุกตัวต้องมีใน exercises table
  if (Array.isArray(data.exercises)) {
    const exerciseIds = data.exercises.map((ex: any) => ex.id).filter((id: any) => !!id)
    if (exerciseIds.length > 0) {
      const { rows } = await pool.query(
        'SELECT id FROM exercises WHERE id = ANY($1::bigint[])',
        [exerciseIds]
      )
      const foundIds = rows.map(r => String(r.id))
      const missingIds = exerciseIds.filter((id: any) => !foundIds.includes(String(id)))
      if (missingIds.length > 0) {
        return NextResponse.json({ error: `exerciseId(s) not found: ${missingIds.join(', ')}` }, { status: 400 })
      }
    }
  }

  const res = await pool.query(
    `INSERT INTO templates (user_id, name, type, exercises, category, created_at)
   VALUES ($1, $2, $3, $4, $5, $6)
   RETURNING *`,
    [
      userId,
      data.name,
      data.type,                    // ⭐ ตรงนี้
      JSON.stringify(data.exercises),
      data.category,
      data.createdAt ?? new Date(),  // กัน null
    ]
  )
  return NextResponse.json({ template: res.rows[0] })
}

// PUT: แก้ไข template (ต้องส่ง id)
export async function PUT(req: NextRequest) {
  const data = await req.json()
  // Validation: ตรวจสอบ exerciseId ทุกตัวต้องมีใน exercises table
  if (Array.isArray(data.exercises)) {
    const exerciseIds = data.exercises.map((ex: any) => ex.id).filter((id: any) => !!id)
    if (exerciseIds.length > 0) {
      const { rows } = await pool.query(
        'SELECT id FROM exercises WHERE id = ANY($1::bigint[])',
        [exerciseIds]
      )
      const foundIds = rows.map(r => String(r.id))
      const missingIds = exerciseIds.filter((id: any) => !foundIds.includes(String(id)))
      if (missingIds.length > 0) {
        return NextResponse.json({ error: `exerciseId(s) not found: ${missingIds.join(', ')}` }, { status: 400 })
      }
    }
  }
  const res = await pool.query(
    `UPDATE templates SET
    name = $2,
    type = $3,
    exercises = $4,
    category = $5,
    created_at = $6
   WHERE id = $1
   RETURNING *`,
    [
      data.id,
      data.name,
      data.type,
      JSON.stringify(data.exercises),
      data.category,
      data.createdAt ?? new Date(),
    ]
  )

  return NextResponse.json({ template: res.rows[0] })
}

// DELETE: ลบ template (ต้องส่ง id)
export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  await pool.query('DELETE FROM templates WHERE id=$1', [id])
  return NextResponse.json({ success: true })
} 