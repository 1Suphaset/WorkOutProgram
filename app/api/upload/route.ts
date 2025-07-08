import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
  const uploadPath = path.join(process.cwd(), 'public', 'Images', filename);

  await writeFile(uploadPath, buffer);

  // return URL/path สำหรับบันทึกใน DB
  return NextResponse.json({ url: `/Images/${filename}` });
} 