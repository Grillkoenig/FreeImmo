import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import InseratCard from '@/components/InseratCard'
import SearchForm from '@/components/SearchForm'
import Link from 'next/link'

type SearchParams = {
  ort?: string
  modus?: string
  typ?: string
  zimmerMin?: string
  preisMax?: string
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

  return prisma.inserat.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  })
}

function FilterBadges({ params }: { params: SearchParams }) {
  const active = Object.entries(params).filter(([, v]) => v)
  if (active.length === 0) return null

  const labels: Record<string, string> = {
    ort: 'Ort',
    modus: 'Modus',
    typ: 'Typ',
    zimmerMin: 'Zimmer min.',
    preisMax: 'Preis max.',
  }

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {active.map(([k, v]) => (
        <span key={k} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-pink-50 text-sm font-medium" style={{ color: 'var(--primary)', border: '1px solid var(--primary)' }}>
          {labels[k]}: {v}
        </span>
      ))}
      <Link href="/inserate" className="px-3 py-1 rounded-full text-sm text-gray-500 border border-gray-200 hover:bg-gray-50">
        Filter zurücksetzen
      </Link>
    </div>
  )
}

type PageProps = {
  searchParams: Promise<SearchParams>
}

export default async function InseratListPage({ searchParams }: PageProps) {
  const params = await searchParams
  const inserate = await getInserate(params)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search bar */}
      <div className="mb-8">
        <Suspense>
          <SearchForm compact />
        </Suspense>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inserate</h1>
          <p className="text-gray-500 text-sm mt-1">{inserate.length} Ergebnisse</p>
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
