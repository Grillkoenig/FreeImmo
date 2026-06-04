import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const plz = req.nextUrl.searchParams.get('plz')
  if (!plz || !/^\d{4}$/.test(plz)) return NextResponse.json({ kanton: null })

  try {
    const res = await fetch(
      `https://openplzapi.org/ch/Localities?postalCode=${plz}&page=1&pageSize=1`,
      { next: { revalidate: 86400 } }
    )
    const data = await res.json()
    const kanton = data[0]?.canton?.shortName ?? null
    return NextResponse.json({ kanton })
  } catch {
    return NextResponse.json({ kanton: null })
  }
}
