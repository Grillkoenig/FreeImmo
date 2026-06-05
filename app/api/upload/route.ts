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

// --- Rate limiting --------------------------------------------------------
// 20 files per user per 60-second window. Module-level so it persists across
// requests within the same server process.
const RATE_LIMIT_MAX = 20
const RATE_LIMIT_WINDOW_MS = 60_000

type RateEntry = { count: number; resetAt: number }
const rateLimitMap = new Map<string, RateEntry>()

function checkRateLimit(userId: string, fileCount: number): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(userId)

  if (!entry || now >= entry.resetAt) {
    rateLimitMap.set(userId, { count: fileCount, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return true
  }

  if (entry.count + fileCount > RATE_LIMIT_MAX) return false

  entry.count += fileCount
  return true
}

// Prevent unbounded map growth: evict expired entries whenever a new one is added.
// Only runs when the map is non-trivially large, so the overhead is negligible.
function evictExpired() {
  if (rateLimitMap.size < 100) return
  const now = Date.now()
  for (const [key, entry] of rateLimitMap) {
    if (now >= entry.resetAt) rateLimitMap.delete(key)
  }
}

// --- Magic byte validation ------------------------------------------------
// Each MIME type maps to one or more candidate byte signatures.
// WEBP and HEIC/HEIF need special multi-offset checks handled below.
const MAGIC_SIGNATURES: Record<string, number[][]> = {
  'image/jpeg':      [[0xFF, 0xD8, 0xFF]],
  'image/png':       [[0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]],
  'image/webp':      [[0x52, 0x49, 0x46, 0x46]], // RIFF header — bytes 8–11 also checked
  'image/heic':      [[]], // validated via ftyp box at offset 4
  'image/heif':      [[]], // validated via ftyp box at offset 4
  'application/pdf': [[0x25, 0x50, 0x44, 0x46]], // %PDF
}

function hasMagicBytes(buf: Buffer, mimeType: string): boolean {
  if (!(mimeType in MAGIC_SIGNATURES)) return false

  if (mimeType === 'image/webp') {
    // Bytes 0–3: "RIFF", bytes 8–11: "WEBP"
    return (
      buf.length >= 12 &&
      buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 &&
      buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50
    )
  }

  if (mimeType === 'image/heic' || mimeType === 'image/heif') {
    // ISO base media file format: bytes 4–7 must be "ftyp"
    return (
      buf.length >= 8 &&
      buf[4] === 0x66 && buf[5] === 0x74 && buf[6] === 0x79 && buf[7] === 0x70
    )
  }

  const sigs = MAGIC_SIGNATURES[mimeType]
  return sigs.some(sig => sig.length > 0 && sig.every((byte, i) => buf[i] === byte))
}

// --------------------------------------------------------------------------

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

  evictExpired()
  if (!checkRateLimit(session.user.id, files.length)) {
    return NextResponse.json(
      { error: `Upload-Limit erreicht. Maximal ${RATE_LIMIT_MAX} Dateien pro Minute erlaubt.` },
      { status: 429 }
    )
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

    if (!hasMagicBytes(buffer, file.type)) {
      return NextResponse.json({ error: `Ungültiger Dateiinhalt: ${file.name}` }, { status: 400 })
    }

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
