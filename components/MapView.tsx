'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import type { LatLngExpression } from 'leaflet'
import Link from 'next/link'

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

type Props = {
  listings: Listing[]
  center?: [number, number]
  zoom?: number
  single?: boolean
}

function RecenterMap({ center, zoom }: { center: LatLngExpression; zoom: number }) {
  const map = useMap()
  useEffect(() => { map.setView(center, zoom) }, [center, zoom, map])
  return null
}

export default function MapView({ listings, center = [46.8182, 8.2275], zoom = 8, single = false }: Props) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className="w-full h-full rounded-xl z-0"
      scrollWheelZoom={!single}
    >
      <RecenterMap center={center} zoom={zoom} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {listings.map(l => (
        <Marker key={l.id} position={[l.lat, l.lng]}>
          <Popup maxWidth={220} className="leaflet-popup-freeimmo">
            {l.bilder[0] && (
              <img
                src={l.bilder[0]}
                alt={l.titel}
                className="w-full object-cover rounded-t mb-2"
                style={{ height: '110px', display: 'block', margin: '-14px -20px 10px', width: 'calc(100% + 40px)' }}
              />
            )}
            <p className="font-semibold text-gray-900 text-sm leading-tight mb-1">{l.titel}</p>
            <p className="text-xs text-gray-500 mb-2">{l.ort} · {l.zimmer} Zi. · {l.flaeche} m²</p>
            <p className="font-bold text-sm mb-3" style={{ color: 'var(--primary)' }}>
              CHF {l.preis.toLocaleString('de-CH')}
              {l.modus === 'mieten' && <span className="font-normal text-gray-400 text-xs"> /Mt.</span>}
            </p>
            <Link
              href={`/inserate/${l.id}`}
              className="block text-center text-xs font-semibold text-white py-1.5 rounded-lg"
              style={{ backgroundColor: 'var(--primary)' }}
            >
              Zum Inserat →
            </Link>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
