import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import { pool } from "@/lib/db"


// GET: ดึง reminders ทั้งหมดของ user
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userEmail = searchParams.get('user')
  if (!userEmail) return NextResponse.json({ error: 'Missing user' }, { status: 400 })

  const userRes = await pool.query('SELECT id FROM users WHERE email=$1', [userEmail])
  if (!userRes.rows[0]) return NextResponse.json({ reminders: [] })
  const userId = userRes.rows[0].id

  const result = await pool.query('SELECT * FROM reminders WHERE user_id=$1 ORDER BY created_at DESC', [userId])
  return NextResponse.json({ reminders: result.rows })
}

// POST: เพิ่ม reminder ใหม่
export async function POST(req: NextRequest) {
  const data = await req.json()
  const userRes = await pool.query('SELECT id FROM users WHERE email=$1', [data.userEmail])
  if (!userRes.rows[0]) return NextResponse.json({ error: 'User not found' }, { status: 400 })
  const userId = userRes.rows[0].id

  const res = await pool.query(
    `INSERT INTO reminders (user_id, enabled, time, method, created_at)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [
      userId,
      data.enabled,
      data.time,
      data.method,
      data.createdAt,
    ]
  )
  return NextResponse.json({ reminder: res.rows[0] })
}

// PUT: แก้ไข reminder (ต้องส่ง id)
export async function PUT(req: NextRequest) {
  const data = await req.json()
  const res = await pool.query(
    `UPDATE reminders SET
      enabled=$2, time=$3, method=$4, created_at=$5
     WHERE id=$1
     RETURNING *`,
    [
      data.id,
      data.enabled,
      data.time,
      data.method,
      data.createdAt,
    ]
  )
  return NextResponse.json({ reminder: res.rows[0] })
}

// DELETE: ลบ reminder (ต้องส่ง id)
export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  await pool.query('DELETE FROM reminders WHERE id=$1', [id])
  return NextResponse.json({ success: true })
} 