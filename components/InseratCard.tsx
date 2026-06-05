import Link from 'next/link'

type Inserat = {
  id: string
  titel: string
  preis: number
  zimmer: number
  flaeche: number
  strasse: string
  plz: string
  ort: string
  typ: string
  modus: string
  bilder: string[]
  viewsTotal?: number
  viewsHeute?: number
}

export default function InseratCard({ inserat }: { inserat: Inserat }) {
  const placeholder = `https://placehold.co/600x400/e8f4f8/64748b?text=${encodeURIComponent(inserat.ort)}`
  const bildUrl = inserat.bilder.length > 0 ? inserat.bilder[0] : placeholder

  return (
    <Link href={`/inserate/${inserat.id}`} className="group block bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-200">
      <div className="relative overflow-hidden bg-gray-100" style={{ height: '200px' }}>
        <img
          src={bildUrl}
          alt={inserat.titel}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span
          className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-semibold text-white"
          style={{ backgroundColor: 'var(--primary)' }}
        >
          {inserat.modus === 'mieten' ? 'Mieten' : 'Kaufen'}
        </span>
        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700">
          {{ wohnung: 'Wohnung', haus: 'Haus', studio: 'Studio', studentenwohnung: 'Studentenwohnung', gewerbe: 'Gewerbe' }[inserat.typ] ?? inserat.typ}
        </span>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-base leading-tight line-clamp-2 group-hover:text-[var(--primary)] transition-colors">
          {inserat.titel}
        </h3>
        <p className="text-gray-500 text-sm mt-1">
          {inserat.strasse}, {inserat.plz} {inserat.ort}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {{ wohnung: 'Wohnung', haus: 'Haus', studio: 'Studio', studentenwohnung: 'Studentenwohnung', gewerbe: 'Gewerbe' }[inserat.typ] ?? inserat.typ}
        </p>

        <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {inserat.zimmer} Zi.
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            {inserat.flaeche} m²
          </span>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100 flex items-end justify-between gap-2">
          <p className="font-bold text-gray-900 text-lg">
            CHF {inserat.preis.toLocaleString('de-CH')}
            {inserat.modus === 'mieten' && <span className="text-sm font-normal text-gray-500"> / Monat</span>}
          </p>
          {inserat.viewsTotal !== undefined && (
            <p className="text-[11px] text-gray-400 whitespace-nowrap leading-tight text-right flex-shrink-0">
              <svg className="w-3 h-3 inline mr-0.5 -mt-px" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {inserat.viewsTotal} gesamt · {inserat.viewsHeute ?? 0} heute
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}
