'use server'

import { redirect } from 'next/navigation'
import { unlink } from 'fs/promises'
import { join } from 'path'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function parseInseratFields(formData: FormData) {
  const preis = parseInt(formData.get('preis') as string)
  const zimmer = parseFloat(formData.get('zimmer') as string)
  const flaeche = parseInt(formData.get('flaeche') as string)
  if (isNaN(preis) || isNaN(zimmer) || isNaN(flaeche)) throw new Error('Ungültige Zahlenangaben')
  return {
    titel: (formData.get('titel') as string).trim(),
    beschreibung: (formData.get('beschreibung') as string).trim(),
    preis,
    zimmer,
    flaeche,
    strasse: (formData.get('strasse') as string).trim(),
    plz: (formData.get('plz') as string).trim(),
    ort: (formData.get('ort') as string).trim(),
    typ: formData.get('typ') as string,
    modus: formData.get('modus') as string,
    aktiv: formData.get('aktiv') !== 'false',
  }
}

async function deleteUploadedFiles(bilder: string[]) {
  for (const url of bilder) {
    if (!url.startsWith('/uploads/')) continue
    const filepath = join(process.cwd(), 'public', url)
    await unlink(filepath).catch(() => {})
  }
}

export async function createInserat(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/login?callbackUrl=/inserat-aufgeben')

  const inserat = await prisma.inserat.create({
    data: {
      ...parseInseratFields(formData),
      bilder: formData.getAll('bilder').map(String).filter(Boolean),
      userId: session.user.id,
    },
  })

  redirect(`/inserate/${inserat.id}`)
}

export async function updateInserat(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/login')

  const id = formData.get('id') as string
  const existing = await prisma.inserat.findUnique({ where: { id }, select: { userId: true, bilder: true } })
  if (!existing || existing.userId !== session.user.id) throw new Error('Nicht autorisiert')

  const newBilder = formData.getAll('bilder').map(String).filter(Boolean)
  const removedBilder = existing.bilder.filter(b => !newBilder.includes(b))
  await deleteUploadedFiles(removedBilder)

  await prisma.inserat.update({
    where: { id },
    data: { ...parseInseratFields(formData), bilder: newBilder },
  })

  redirect(`/inserate/${id}`)
}

export async function deleteInserat(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/login')

  const id = formData.get('id') as string
  const existing = await prisma.inserat.findUnique({ where: { id }, select: { userId: true, bilder: true } })
  if (!existing || existing.userId !== session.user.id) throw new Error('Nicht autorisiert')

  await deleteUploadedFiles(existing.bilder)
  await prisma.inserat.delete({ where: { id } })

  redirect('/meine-inserate?deleted=1')
}
