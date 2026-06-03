'use client'

import dynamic from 'next/dynamic'
import { useEffect } from 'react'

const MapView = dynamic(() => import('./MapView'), { ssr: false, loading: () => (
  <div className="w-full h-full rounded-xl bg-gray-100 animate-pulse" />
)})

type Props = {
  lat: number
  lng: number
  titel: string
  preis: number
  zimmer: number
  flaeche: number
  ort: string
  modus: string
  bilder: string[]
  id: string
}

export default function DetailMap({ lat, lng, ...rest }: Props) {
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

  return (
    <MapView
      listings={[{ lat, lng, typ: '', ...rest }]}
      center={[lat, lng]}
      zoom={15}
      single
    />
  )
}
