'use client'

import dynamic from 'next/dynamic'
import { useEffect } from 'react'

const MapView = dynamic(() => import('./MapView'), { ssr: false, loading: () => <MapSkeleton /> })

function MapSkeleton() {
  return (
    <div className="w-full h-full rounded-xl bg-gray-100 flex items-center justify-center">
      <div className="flex flex-col items-center gap-2 text-gray-400">
        <svg className="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <span className="text-sm">Karte wird geladen…</span>
      </div>
    </div>
  )
}

type Listing = {
  id: string
  titel: string
  preis: number
  zimmer: number
  flaeche: number
  ort: string
  modus: string
  typ: string
  bilder: string[]
  lat: number
  lng: number
}

type Props = { listings: Listing[] }

export default function InserateMap({ listings }: Props) {
  // Fix Leaflet default icon paths (webpack issue)
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const L = require('leaflet')
    delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl
    L.Icon.Default.mergeOptions({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    })
  }, [])

  return <MapView listings={listings} />
}
