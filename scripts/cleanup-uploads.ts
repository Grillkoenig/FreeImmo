import { PrismaClient } from '@prisma/client'
import { readdirSync, statSync, unlinkSync } from 'fs'
import { join } from 'path'

const prisma = new PrismaClient()
const DRY_RUN = process.argv.includes('--dry-run')

// Files younger than this are skipped — they may belong to a form still being filled out.
const GRACE_PERIOD_MS = 24 * 60 * 60 * 1000

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

async function main() {
  const uploadsDir = join(process.cwd(), 'public', 'uploads')

  const allFiles = readdirSync(uploadsDir).filter(f => !f.startsWith('.'))

  const inserate = await prisma.inserat.findMany({ select: { bilder: true, dokumente: true } })

  const referenced = new Set<string>()
  for (const i of inserate) {
    for (const url of [...i.bilder, ...i.dokumente]) {
      if (url.startsWith('/uploads/')) referenced.add(url.slice('/uploads/'.length))
    }
  }

  const now = Date.now()
  let deleted = 0
  let skippedRecent = 0
  let freedBytes = 0

  for (const filename of allFiles) {
    if (referenced.has(filename)) continue

    const filePath = join(uploadsDir, filename)
    const stat = statSync(filePath)

    if (now - stat.mtimeMs < GRACE_PERIOD_MS) {
      skippedRecent++
      continue
    }

    freedBytes += stat.size

    if (DRY_RUN) {
      console.log(`[dry-run] ${filename}  (${formatBytes(stat.size)})`)
    } else {
      unlinkSync(filePath)
      console.log(`Deleted   ${filename}  (${formatBytes(stat.size)})`)
    }
    deleted++
  }

  const prefix = DRY_RUN ? '[dry-run] ' : ''
  console.log(
    `\n${prefix}${deleted} file${deleted !== 1 ? 's' : ''} ${DRY_RUN ? 'would be deleted' : 'deleted'} ` +
    `(${formatBytes(freedBytes)} freed)` +
    (skippedRecent ? `, ${skippedRecent} skipped (uploaded < 24 h ago)` : '')
  )
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
