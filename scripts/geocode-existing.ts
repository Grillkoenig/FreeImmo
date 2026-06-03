import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function geocode(strasse: string, plz: string, ort: string) {
  const q = encodeURIComponent(`${strasse}, ${plz} ${ort}, Schweiz`)
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1&countrycodes=ch`,
    { headers: { 'User-Agent': 'FreeImmo/1.0 (freeimmo.ch)' } }
  )
  const data = await res.json()
  if (!data.length) return null
  return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
}

function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms))
}

async function main() {
  const inserate = await prisma.inserat.findMany({
    where: { lat: null },
    select: { id: true, strasse: true, plz: true, ort: true },
  })

  console.log(`${inserate.length} Inserate ohne Koordinaten`)

  let ok = 0, fail = 0
  for (const i of inserate) {
    const coords = await geocode(i.strasse, i.plz, i.ort)
    if (coords) {
      await prisma.inserat.update({ where: { id: i.id }, data: coords })
      console.log(`✓ ${i.strasse}, ${i.ort} → ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`)
      ok++
    } else {
      console.log(`✗ ${i.strasse}, ${i.ort} — nicht gefunden`)
      fail++
    }
    await sleep(1100) // Nominatim rate limit: 1 req/sec
  }

  console.log(`\nFertig: ${ok} geocodiert, ${fail} nicht gefunden`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
