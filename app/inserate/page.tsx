import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import InseratCard from '@/components/InseratCard'
import SearchForm from '@/components/SearchForm'
import InserateMapWrapper from './map-wrapper'
import Link from 'next/link'

type SearchParams = {
  ort?: string
  modus?: string
  typ?: string
  zimmerMin?: string
  preisMax?: string
  ansicht?: string
}

async function getInserate(params: SearchParams) {
  const where: Record<string, unknown> = { aktiv: true }
  if (params.ort) {
    where.OR = [
      { ort: { contains: params.ort, mode: 'insensitive' } },
      { plz: { contains: params.ort, mode: 'insensitive' } },
      { strasse: { contains: params.ort, mode: 'insensitive' } },
    ]
  }
  if (params.modus) where.modus = params.modus
  if (params.typ) where.typ = params.typ
  if (params.zimmerMin) where.zimmer = { gte: parseFloat(params.zimmerMin) }
  if (params.preisMax) where.preis = { lte: parseInt(params.preisMax) }
  return prisma.inserat.findMany({ where, orderBy: { createdAt: 'desc' } })
}

function FilterBadges({ params }: { params: SearchParams }) {
  const active = Object.entries(params).filter(([k, v]) => v && k !== 'ansicht')
  if (!active.length) return null
  const labels: Record<string, string> = { ort: 'Ort', modus: 'Modus', typ: 'Typ', zimmerMin: 'Zimmer min.', preisMax: 'Preis max.' }
  const base = params.ansicht === 'karte' ? '/inserate?ansicht=karte' : '/inserate'
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {active.map(([k, v]) => (
        <span key={k} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-pink-50 text-sm font-medium" style={{ color: 'var(--primary)', border: '1px solid var(--primary)' }}>
          {labels[k]}: {v}
        </span>
      ))}
      <Link href={base} className="px-3 py-1 rounded-full text-sm text-gray-500 border border-gray-200 hover:bg-gray-50">
        Filter zurücksetzen
      </Link>
    </div>
  )
}

type PageProps = { searchParams: Promise<SearchParams> }

export default async function InseratListPage({ searchParams }: PageProps) {
  const params = await searchParams
  const inserate = await getInserate(params)
  const isMap = params.ansicht === 'karte'

  const mapListings = inserate
    .filter(i => i.lat && i.lng)
    .map(i => ({
      id: i.id, titel: i.titel, preis: i.preis, zimmer: i.zimmer,
      flaeche: i.flaeche, ort: i.ort, modus: i.modus, typ: i.typ,
      bilder: i.bilder, lat: i.lat!, lng: i.lng!,
    }))

  const toggleHref = (view: string) => {
    const q = new URLSearchParams({ ...params, ansicht: view })
    return `/inserate?${q}`
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Suspense>
          <SearchForm compact />
        </Suspense>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inserate</h1>
          <p className="text-gray-500 text-sm mt-1">{inserate.length} Ergebnisse</p>
        </div>

        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <Link
              href={toggleHref('liste')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                !isMap ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Liste
            </Link>
            <Link
              href={toggleHref('karte')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                isMap ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Karte
            </Link>
          </div>

          <Link
            href="/inserat-aufgeben"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Inserat aufgeben
          </Link>
        </div>
      </div>

      <FilterBadges params={params} />

      {inserate.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-gray-200">
          <svg className="w-16 h-16 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-gray-500 text-lg mb-2">Keine Inserate gefunden</p>
          <p className="text-gray-400 text-sm mb-6">Versuche andere Suchkriterien oder entferne Filter.</p>
          <Link href="/inserate" className="text-sm font-medium" style={{ color: 'var(--primary)' }}>
            Alle Inserate anzeigen
          </Link>
        </div>
      ) : isMap ? (
        <div className="rounded-2xl overflow-hidden border border-gray-200" style={{ height: '70vh' }}>
          <InserateMapWrapper listings={mapListings} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {inserate.map(i => (
            <InseratCard key={i.id} inserat={i} />
          ))}
        </div>
      )}
    </div>
  )
}
