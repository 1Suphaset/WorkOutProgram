import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import { pool } from "@/lib/db"


// GET: ดึง settings ของ user
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userEmail = searchParams.get('user')
  if (!userEmail) return NextResponse.json({ error: 'Missing user' }, { status: 400 })

  const userRes = await pool.query('SELECT id FROM users WHERE email=$1', [userEmail])
  if (!userRes.rows[0]) return NextResponse.json({ settings: null })
  const userId = userRes.rows[0].id

  const result = await pool.query('SELECT * FROM settings WHERE user_id=$1 LIMIT 1', [userId])
  return NextResponse.json({ settings: result.rows[0] || null })
}

// POST: เพิ่ม settings ใหม่ (หรือ update ถ้ามีอยู่แล้ว)
export async function POST(req: NextRequest) {
  const data = await req.json()
  const userRes = await pool.query('SELECT id FROM users WHERE email=$1', [data.userEmail])
  if (!userRes.rows[0]) return NextResponse.json({ error: 'User not found' }, { status: 400 })
  const userId = userRes.rows[0].id

  // upsert
  const res = await pool.query(
    `INSERT INTO settings (user_id, name, email, notifications, reminder_time, units, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (user_id) DO UPDATE SET
       name=EXCLUDED.name, email=EXCLUDED.email, notifications=EXCLUDED.notifications, reminder_time=EXCLUDED.reminder_time, units=EXCLUDED.units, created_at=EXCLUDED.created_at
     RETURNING *`,
    [
      userId,
      data.name,
      data.email,
      data.notifications,
      data.reminderTime,
      data.units,
      data.createdAt,
    ]
  )
  return NextResponse.json({ settings: res.rows[0] })
}

// PUT: แก้ไข settings (ต้องส่ง userEmail)
export async function PUT(req: NextRequest) {
  const data = await req.json()
  const userRes = await pool.query('SELECT id FROM users WHERE email=$1', [data.userEmail])
  if (!userRes.rows[0]) return NextResponse.json({ error: 'User not found' }, { status: 400 })
  const userId = userRes.rows[0].id

  const res = await pool.query(
    `UPDATE settings SET
      name=$2, email=$3, notifications=$4, reminder_time=$5, units=$6, created_at=$7
     WHERE user_id=$1
     RETURNING *`,
    [
      userId,
      data.name,
      data.email,
      data.notifications,
      data.reminderTime,
      data.units,
      data.createdAt,
    ]
  )
  return NextResponse.json({ settings: res.rows[0] })
}

// DELETE: ลบ settings (ต้องส่ง userEmail)
export async function DELETE(req: NextRequest) {
  const { userEmail } = await req.json()
  const userRes = await pool.query('SELECT id FROM users WHERE email=$1', [userEmail])
  if (!userRes.rows[0]) return NextResponse.json({ error: 'User not found' }, { status: 400 })
  const userId = userRes.rows[0].id
  await pool.query('DELETE FROM settings WHERE user_id=$1', [userId])
  return NextResponse.json({ success: true })
} 