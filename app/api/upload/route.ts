import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { randomUUID } from 'crypto'
import sharp from 'sharp'

const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'])
const MAX_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB
const MAX_PDF_SIZE_BYTES = 20 * 1024 * 1024 // 20 MB
const MAX_FILES = 10
const MAX_DIMENSION = 1920

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })
  }

  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage' }, { status: 400 })
  }

  const files = formData.getAll('files') as File[]
  if (!files.length) {
    return NextResponse.json({ error: 'Keine Dateien erhalten' }, { status: 400 })
  }
  if (files.length > MAX_FILES) {
    return NextResponse.json({ error: `Maximal ${MAX_FILES} Dateien erlaubt` }, { status: 400 })
  }

  const uploadDir = join(process.cwd(), 'public', 'uploads')
  const urls: string[] = []

  for (const file of files) {
    const isPdf = file.type === 'application/pdf'
    const isImage = ALLOWED_IMAGE_TYPES.has(file.type)

    if (!isPdf && !isImage) {
      return NextResponse.json({ error: `Ungültiger Dateityp: ${file.type}` }, { status: 400 })
    }

    const maxSize = isPdf ? MAX_PDF_SIZE_BYTES : MAX_SIZE_BYTES
    if (file.size > maxSize) {
      const mb = maxSize / 1024 / 1024
      return NextResponse.json({ error: `Datei zu groß (max. ${mb} MB): ${file.name}` }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    if (isPdf) {
      const filename = `${randomUUID()}.pdf`
      await writeFile(join(uploadDir, filename), buffer)
      urls.push(`/uploads/${filename}`)
    } else {
      const filename = `${randomUUID()}.webp`
      await sharp(buffer)
        .resize(MAX_DIMENSION, MAX_DIMENSION, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(join(uploadDir, filename))
      urls.push(`/uploads/${filename}`)
    }
  }

  return NextResponse.json({ urls })
}
