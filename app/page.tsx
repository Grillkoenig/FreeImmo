import { Suspense } from 'react'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import SearchForm from '@/components/SearchForm'
import InseratCard from '@/components/InseratCard'

export const dynamic = 'force-dynamic'

async function getLatestInserate() {
  return prisma.inserat.findMany({
    where: { aktiv: true },
    orderBy: { createdAt: 'desc' },
    take: 6,
  })
}

async function getStats() {
  const [total, orte] = await Promise.all([
    prisma.inserat.count({ where: { aktiv: true } }),
    prisma.inserat.findMany({
      where: { aktiv: true },
      select: { ort: true },
      distinct: ['ort'],
    }),
  ])
  return { total, orteCount: orte.length }
}

const KANTONS = ['Zürich', 'Bern', 'Basel', 'Genf', 'Lausanne', 'Luzern', 'St. Gallen', 'Winterthur']

export default async function HomePage() {
  const [inserate, stats] = await Promise.all([getLatestInserate(), getStats()])

  return (
    <div>
      {/* Hero */}
      <section
        className="relative py-20 px-4"
        style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Dein neues Zuhause<br />
            <span style={{ color: 'var(--primary)' }}>wartet auf dich</span>
          </h1>
          <p className="text-gray-300 text-lg mb-10">
            {stats.total} Inserate in {stats.orteCount} Orten in der Schweiz
          </p>

          <Suspense>
            <SearchForm />
          </Suspense>
        </div>

        {/* Stats bar */}
        <div className="max-w-4xl mx-auto mt-10 grid grid-cols-3 gap-4 text-center">
          {[
            { label: 'Inserate', value: stats.total.toLocaleString('de-CH') },
            { label: 'Städte', value: stats.orteCount.toLocaleString('de-CH') },
            { label: 'Kostenlos', value: '100%' },
          ].map(s => (
            <div key={s.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-gray-300 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick links by location */}
      <section className="py-10 px-4 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-sm font-medium text-gray-500 mb-4">Beliebte Städte</h2>
          <div className="flex flex-wrap gap-2">
            {KANTONS.map(k => (
              <Link
                key={k}
                href={`/inserate?ort=${encodeURIComponent(k)}`}
                className="px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-colors"
              >
                {k}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest listings */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Neueste Inserate</h2>
            <Link
              href="/inserate"
              className="text-sm font-medium flex items-center gap-1 transition-colors"
              style={{ color: 'var(--primary)' }}
            >
              Alle anzeigen
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {inserate.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
              <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <p className="text-gray-500 mb-4">Noch keine Inserate vorhanden.</p>
              <Link
                href="/inserat-aufgeben"
                className="px-6 py-2.5 rounded-lg text-white font-medium text-sm inline-block"
                style={{ backgroundColor: 'var(--primary)' }}
              >
                Erstes Inserat aufgeben
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
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Immobilie vermieten oder verkaufen?</h2>
          <p className="text-gray-500 mb-8 text-lg">
            Kostenlos inserieren und tausende potenzielle Käufer und Mieter erreichen.
          </p>
          <Link
            href="/inserat-aufgeben"
            className="inline-block px-8 py-3.5 rounded-xl text-white font-semibold text-base transition-colors"
            style={{ backgroundColor: 'var(--primary)' }}
            onMouseOver={undefined}
          >
            Jetzt kostenlos inserieren
          </Link>
        </div>
      </section>
    </div>
  )
}
