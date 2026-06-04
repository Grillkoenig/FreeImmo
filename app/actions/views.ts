'use server'

import { headers } from 'next/headers'
import { promises as dns } from 'dns'
import { prisma } from '@/lib/prisma'

async function reverseLookup(ip: string | null): Promise<string | null> {
  if (!ip) return null
  try {
    const result = await Promise.race([
      dns.reverse(ip),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), 2000)),
    ])
    return result[0] ?? null
  } catch {
    return null
  }
}

export async function trackView(inseratId: string) {
  const h = await headers()

  const ip =
    h.get('x-forwarded-for')?.split(',')[0].trim() ??
    h.get('x-real-ip') ??
    null

  const host = h.get('host') ?? null
  const ipDomain = await reverseLookup(ip)

  await prisma.inseratView.create({ data: { inseratId, ip, ipDomain, host } })
}
