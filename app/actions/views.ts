'use server'

import { prisma } from '@/lib/prisma'

export async function trackView(inseratId: string) {
  await prisma.inseratView.create({ data: { inseratId } })
}
