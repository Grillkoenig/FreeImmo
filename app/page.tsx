import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import InseratCard from '@/components/InseratCard'
import HomeHero from '@/components/HomeHero'

export const dynamic = 'force-dynamic'

function startOfToday() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

async function getLatestInserate() {
  const today = startOfToday()
  const inserate = await prisma.inserat.findMany({
    where: { aktiv: true },
    orderBy: { createdAt: 'desc' },
    take: 6,
    include: { _count: { select: { views: true } } },
  })
  const ids = inserate.map(i => i.id)
  const todayCounts = await prisma.inseratView.groupBy({
    by: ['inseratId'],
    where: { inseratId: { in: ids }, createdAt: { gte: today } },
    _count: { id: true },
  })
  const todayMap = Object.fromEntries(todayCounts.map(t => [t.inseratId, t._count.id]))
  return inserate.map(i => ({ ...i, viewsTotal: i._count.views, viewsHeute: todayMap[i.id] ?? 0 }))
}

async function getStats() {
  const [total, orte] = await Promise.all([
    prisma.inserat.count({ where: { aktiv: true } }),
    prisma.inserat.findMany({ where: { aktiv: true }, select: { ort: true }, distinct: ['ort'] }),
  ])
  return { total, orteCount: orte.length }
}

export default async function HomePage() {
  const [inserate, stats] = await Promise.all([getLatestInserate(), getStats()])

  return (
    <div>
      <HomeHero total={stats.total} orteCount={stats.orteCount} />

      {/* Latest listings */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Neueste Inserate</h2>
            <Link
              href="/inserate"
              className="text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
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
              <Link href="/inserat-aufgeben" className="btn-primary px-6 py-2.5 rounded-lg font-medium text-sm inline-block">
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
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/inserat-aufgeben"
              className="btn-primary inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-base active:scale-95 transition-transform"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Jetzt kostenlos inserieren
            </Link>
            <Link
              href="/inserate"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-base border-2 border-gray-200 text-gray-700 hover:border-gray-400 hover:bg-gray-50 active:scale-95 transition-all"
            >
              Inserate durchsuchen
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
