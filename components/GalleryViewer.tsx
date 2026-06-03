'use client'

import { useState } from 'react'

type Props = {
  bilder: string[]
  titel: string
}

export default function GalleryViewer({ bilder, titel }: Props) {
  const [active, setActive] = useState(0)

  return (
    <div className="mb-8">
      {/* Main image */}
      <div className="rounded-2xl overflow-hidden bg-gray-100 relative" style={{ height: '420px' }}>
        <img
          key={active}
          src={bilder[active]}
          alt={titel}
          className="w-full h-full object-cover"
        />

        {bilder.length > 1 && (
          <>
            <button
              onClick={() => setActive(i => (i - 1 + bilder.length) % bilder.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
              aria-label="Vorheriges Bild"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setActive(i => (i + 1) % bilder.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
              aria-label="Nächstes Bild"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <span className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
              {active + 1} / {bilder.length}
            </span>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {bilder.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {bilder.map((b, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`flex-shrink-0 rounded-lg overflow-hidden transition-all ${
                active === i
                  ? 'ring-2 ring-offset-1 opacity-100'
                  : 'opacity-60 hover:opacity-90'
              }`}
              style={active === i ? { '--tw-ring-color': 'var(--primary)' } as React.CSSProperties : {}}
            >
              <img
                src={b}
                alt={`Bild ${i + 1}`}
                className="object-cover"
                style={{ width: '80px', height: '60px' }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
