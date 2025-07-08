import { NextRequest, NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  const { url } = await req.json();
  if (!url) return NextResponse.json({ error: 'No image url provided' }, { status: 400 });

  // ป้องกัน path traversal
  if (!url.startsWith('/Images/')) return NextResponse.json({ error: 'Invalid image path' }, { status: 400 });

  const filePath = path.join(process.cwd(), 'public', url);
  try {
    await unlink(filePath);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Delete failed', details: String(err) }, { status: 500 });
  }
} 