import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import GalleryViewer from '@/components/GalleryViewer'
import DeleteButton from '@/components/DeleteButton'
import DetailMap from '@/components/DetailMap'

type Props = { params: Promise<{ id: string }> }

export default async function InseratDetailPage({ params }: Props) {
  const { id } = await params
  const [inserat, session] = await Promise.all([
    prisma.inserat.findUnique({
      where: { id },
      include: { user: { select: { name: true, email: true } } },
    }),
    getServerSession(authOptions),
  ])

  if (!inserat || !inserat.aktiv) notFound()
  const isOwner = session?.user?.id === inserat.userId

  const placeholder = `https://placehold.co/1200x600/e8f4f8/64748b?text=${encodeURIComponent(inserat.ort)}`
  const bilder = inserat.bilder.length > 0 ? inserat.bilder : [placeholder]

  const modusLabel = inserat.modus === 'mieten' ? 'Mieten' : 'Kaufen'
  const typLabel = inserat.typ.charAt(0).toUpperCase() + inserat.typ.slice(1)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb + Owner actions */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <nav className="flex items-center gap-2 text-sm text-gray-500 min-w-0">
          <Link href="/" className="hover:text-gray-900 flex-shrink-0">Start</Link>
          <span>/</span>
          <Link href="/inserate" className="hover:text-gray-900 flex-shrink-0">Inserate</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate">{inserat.titel}</span>
        </nav>

        {isOwner && (
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link
              href={`/inserate/${id}/bearbeiten`}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Bearbeiten
            </Link>
            <DeleteButton inseratId={id} titel={inserat.titel} />
          </div>
        )}
      </div>

      {/* Image gallery */}
      <GalleryViewer bilder={bilder} titel={inserat.titel} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: 'var(--primary)' }}>
                  {modusLabel}
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium text-gray-600 bg-gray-100">
                  {typLabel}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{inserat.titel}</h1>
              <p className="text-gray-500 mt-1">
                {inserat.strasse}, {inserat.plz} {inserat.ort}
              </p>
            </div>
          </div>

          {/* Key facts */}
          <div className="grid grid-cols-3 gap-4 bg-gray-50 rounded-xl p-5 mb-8">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{inserat.zimmer}</p>
              <p className="text-xs text-gray-500 mt-0.5">Zimmer</p>
            </div>
            <div className="text-center border-x border-gray-200">
              <p className="text-2xl font-bold text-gray-900">{inserat.flaeche}</p>
              <p className="text-xs text-gray-500 mt-0.5">m² Wohnfläche</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                CHF {inserat.preis.toLocaleString('de-CH')}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {inserat.modus === 'mieten' ? '/ Monat' : 'Kaufpreis'}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Beschreibung</h2>
            <div className="text-gray-600 leading-relaxed whitespace-pre-wrap">
              {inserat.beschreibung}
            </div>
          </div>

          {/* Location */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Lage</h2>
            <div className="bg-gray-100 rounded-xl p-4 flex items-center gap-3 mb-4">
              <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div>
                <p className="font-medium text-gray-800">{inserat.strasse}</p>
                <p className="text-sm text-gray-500">{inserat.plz} {inserat.ort}{inserat.kanton ? ` · ${inserat.kanton}` : ''}</p>
              </div>
            </div>
            {inserat.lat && inserat.lng && (
              <div style={{ height: '280px' }}>
                <DetailMap
                  lat={inserat.lat}
                  lng={inserat.lng}
                  id={inserat.id}
                  titel={inserat.titel}
                  preis={inserat.preis}
                  zimmer={inserat.zimmer}
                  flaeche={inserat.flaeche}
                  ort={inserat.ort}
                  modus={inserat.modus}
                  bilder={inserat.bilder}
                />
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24">
            <div className="text-center mb-6">
              <p className="text-3xl font-bold text-gray-900">
                CHF {inserat.preis.toLocaleString('de-CH')}
              </p>
              {inserat.modus === 'mieten' && (
                <p className="text-gray-500 text-sm">pro Monat</p>
              )}
            </div>

            <div className="space-y-3 mb-6 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Typ</span>
                <span className="font-medium text-gray-900">{typLabel}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Zimmer</span>
                <span className="font-medium text-gray-900">{inserat.zimmer}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Fläche</span>
                <span className="font-medium text-gray-900">{inserat.flaeche} m²</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Ort</span>
                <span className="font-medium text-gray-900">{inserat.ort}</span>
              </div>
              {inserat.kanton && (
                <div className="flex justify-between text-gray-600">
                  <span>Kanton</span>
                  <span className="font-medium text-gray-900">{inserat.kanton}</span>
                </div>
              )}
            </div>

            {inserat.user && (
              <div className="border-t border-gray-100 pt-5 mb-5">
                <p className="text-xs text-gray-400 mb-2">Anbieter</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm" style={{ backgroundColor: 'var(--primary)' }}>
                    {(inserat.user.name ?? inserat.user.email).charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{inserat.user.name ?? 'Anbieter'}</p>
                    <p className="text-xs text-gray-500">{inserat.user.email}</p>
                  </div>
                </div>
              </div>
            )}

            <a
              href={`mailto:${inserat.user?.email ?? ''}?subject=Anfrage: ${encodeURIComponent(inserat.titel)}`}
              className="block w-full py-3 rounded-xl text-white font-semibold text-sm text-center transition-colors"
              style={{ backgroundColor: 'var(--primary)' }}
            >
              Kontakt aufnehmen
            </a>

            <p className="text-xs text-gray-400 text-center mt-3">
              Inseriert am {new Date(inserat.createdAt).toLocaleDateString('de-CH')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
