import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { unlink } from 'fs/promises'
import { join } from 'path'
import { randomUUID } from 'crypto'
import sharp from 'sharp'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })
  }

  const { url } = await req.json() as { url: string }

  if (!url?.startsWith('/uploads/') || !url.endsWith('.webp')) {
    return NextResponse.json({ error: 'Ungültige Datei' }, { status: 400 })
  }

  const uploadDir = join(process.cwd(), 'public', 'uploads')
  const srcPath = join(process.cwd(), 'public', url)
  const newFilename = `${randomUUID()}.webp`
  const destPath = join(uploadDir, newFilename)

  try {
    await sharp(srcPath).rotate(90).webp({ quality: 85 }).toFile(destPath)
    await unlink(srcPath).catch(() => {})
    return NextResponse.json({ url: `/uploads/${newFilename}` })
  } catch {
    return NextResponse.json({ error: 'Rotation fehlgeschlagen' }, { status: 500 })
  }
}
