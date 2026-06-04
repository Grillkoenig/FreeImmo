'use server'

import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'

export async function trackView(inseratId: string) {
  const h = await headers()

  const ip =
    h.get('x-forwarded-for')?.split(',')[0].trim() ??
    h.get('x-real-ip') ??
    null

  const host = h.get('host') ?? null

  await prisma.inseratView.create({ data: { inseratId, ip, host } })
}
