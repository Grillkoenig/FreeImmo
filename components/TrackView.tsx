'use client'

import { useEffect, useRef } from 'react'
import { trackView } from '@/app/actions/views'

export default function TrackView({ inseratId }: { inseratId: string }) {
  const tracked = useRef(false)
  useEffect(() => {
    if (tracked.current) return
    tracked.current = true
    trackView(inseratId)
  }, [inseratId])
  return null
}
