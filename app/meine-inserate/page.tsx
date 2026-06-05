import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import DeleteButton from '@/components/DeleteButton'

type Props = { searchParams: Promise<{ deleted?: string }> }

export default async function MeineInseratePage({ searchParams }: Props) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login?callbackUrl=/meine-inserate')

  const { deleted } = await searchParams

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const inserate = await prisma.inserat.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { views: true } } },
  })
  const ids = inserate.map(i => i.id)
  const todayCounts = await prisma.inseratView.groupBy({
    by: ['inseratId'],
    where: { inseratId: { in: ids }, createdAt: { gte: today } },
    _count: { id: true },
  })
  const todayMap = Object.fromEntries(todayCounts.map(t => [t.inseratId, t._count.id]))
  const inserateWithViews = inserate.map(i => ({
    ...i,
    viewsTotal: i._count.views,
    viewsHeute: todayMap[i.id] ?? 0,
  }))

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meine Inserate</h1>
          <p className="text-gray-500 text-sm mt-1">
            {inserateWithViews.length} Inserat{inserate.length !== 1 ? 'e' : ''}
          </p>
        </div>
        <Link
          href="/inserat-aufgeben"
          className="btn-primary px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Neu inserieren
        </Link>
      </div>

      {deleted === '1' && (
        <div className="mb-6 flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Inserat wurde erfolgreich gelöscht.
        </div>
      )}

      {inserateWithViews.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-gray-200">
          <svg className="w-14 h-14 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <p className="text-gray-500 mb-2">Du hast noch keine Inserate.</p>
          <Link href="/inserat-aufgeben" className="btn-primary inline-block px-6 py-2.5 rounded-lg text-sm font-medium mt-2">
            Erstes Inserat aufgeben
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {inserateWithViews.map(i => (
            <div
              key={i.id}
              className={`bg-white rounded-xl border p-5 flex flex-col sm:flex-row sm:items-center gap-4 ${
                i.aktiv ? 'border-gray-200' : 'border-gray-200 opacity-60'
              }`}
            >
              {/* Thumbnail */}
              <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                {i.bilder.length > 0 ? (
                  <img src={i.bilder[0]} alt={i.titel} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${i.aktiv ? 'bg-green-400' : 'bg-gray-300'}`} />
                  <span className="text-xs text-gray-400">{i.aktiv ? 'Aktiv' : 'Inaktiv'}</span>
                  {!i.geprueft && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-yellow-100 text-yellow-700">
                      Ausstehend
                    </span>
                  )}
                  <span className="text-xs text-gray-300">·</span>
                  <span className="text-xs text-gray-400">
                    {i.modus === 'mieten' ? 'Mieten' : 'Kaufen'} · {i.typ.charAt(0).toUpperCase() + i.typ.slice(1)}
                  </span>
                  {i.bilder.length > 0 && (
                    <>
                      <span className="text-xs text-gray-300">·</span>
                      <span className="text-xs text-gray-400">{i.bilder.length} Bild{i.bilder.length !== 1 ? 'er' : ''}</span>
                    </>
                  )}
                </div>
                <h2 className="font-semibold text-gray-900 truncate">{i.titel}</h2>
                <p className="text-sm text-gray-500 mt-0.5">{i.strasse}, {i.plz} {i.ort}</p>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-sm font-semibold text-gray-900">
                    CHF {i.preis.toLocaleString('de-CH')}
                    {i.modus === 'mieten' && <span className="font-normal text-gray-400"> / Monat</span>}
                  </p>
                  <p className="text-[11px] text-gray-400 flex items-center gap-0.5">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {i.viewsTotal} gesamt · {i.viewsHeute} heute
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                  href={`/inserate/${i.id}`}
                  className="px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Ansehen
                </Link>
                <Link
                  href={`/inserate/${i.id}/bearbeiten`}
                  className="px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Bearbeiten
                </Link>
                <DeleteButton inseratId={i.id} titel={i.titel} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
