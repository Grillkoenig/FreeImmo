'use client'

import InserateMap from '@/components/InserateMap'

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

export default function InserateMapWrapper({ listings }: { listings: Listing[] }) {
  return <InserateMap listings={listings} />
}
