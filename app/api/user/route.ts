import { NextRequest, NextResponse } from 'next/server'
import { jwtDecode } from 'jwt-decode'
import pool from '@/lib/db'
import bcrypt from 'bcryptjs'

// GET - ดึงข้อมูลผู้ใช้
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 401 })
    }
    const decoded: any = jwtDecode(token)
    const userEmail = decoded.email
    const { rows } = await pool.query(
      'SELECT id, name, email, phone, date_of_birth, height, weight, fitness_level, goals, created_at FROM users WHERE email = $1',
      [userEmail]
    )
    if (rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    // แปลง goals จาก postgres array เป็น JS array (ถ้า null ให้เป็น [])
    const user = rows[0]
    user.goals = user.goals || []
    return NextResponse.json({ user })
  } catch (error) {
    console.error('GET /api/user error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - อัปเดตข้อมูลผู้ใช้
export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 401 })
    }
    const decoded: any = jwtDecode(token)
    const userEmail = decoded.email
    const updateData = await request.json()
    // อัปเดตเฉพาะ field ที่อนุญาต
    const allowedFields = [
      'name', 'phone', 'date_of_birth', 'height', 'weight', 'fitness_level', 'goals'
    ]
    const setClauses = []
    const values = []
    let idx = 1
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        setClauses.push(`${field} = $${idx}`)
        values.push(updateData[field])
        idx++
      }
    })
    if (setClauses.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }
    values.push(userEmail)
    const updateSql = `UPDATE users SET ${setClauses.join(', ')} WHERE email = $${idx} RETURNING id, name, email, phone, date_of_birth, height, weight, fitness_level, goals, created_at`;
    const { rows } = await pool.query(updateSql, values)
    if (rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    const user = rows[0]
    user.goals = user.goals || []
    return NextResponse.json({ user, message: 'User updated successfully' })
  } catch (error) {
    console.error('PUT /api/user error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH - อัปเดตรหัสผ่าน
export async function PATCH(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 401 })
    }
    const decoded: any = jwtDecode(token)
    const userEmail = decoded.email
    const { currentPassword, newPassword } = await request.json()
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Current password and new password required' }, { status: 400 })
    }
    // ตรวจสอบรหัสผ่านเดิม
    const { rows } = await pool.query('SELECT password_hash FROM users WHERE email = $1', [userEmail])
    if (rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    const user = rows[0]
    const isMatch = await bcrypt.compare(currentPassword, user.password_hash)
    if (!isMatch) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
    }
    // อัปเดตรหัสผ่านใหม่ (hash ก่อน)
    const newHash = await bcrypt.hash(newPassword, 10)
    await pool.query('UPDATE users SET password_hash = $1 WHERE email = $2', [newHash, userEmail])
    return NextResponse.json({ message: 'Password updated successfully' })
  } catch (error) {
    console.error('PATCH /api/user error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 