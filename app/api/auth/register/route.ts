import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { Pool } from 'pg';
import { pool } from "@/lib/db"
;

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน' }, { status: 400 });
    }
    // ตรวจสอบ email ซ้ำ
    const { rowCount } = await pool.query('SELECT 1 FROM users WHERE email = $1', [email]);
    if (rowCount && rowCount > 0) {
      return NextResponse.json({ error: 'อีเมลนี้ถูกใช้ไปแล้ว' }, { status: 409 });
    }
    // hash password
    const password_hash = await bcrypt.hash(password, 10);
    // insert user
    await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3)',
      [name, email, password_hash]
    );
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการสมัครสมาชิก' }, { status: 500 });
  }
} 