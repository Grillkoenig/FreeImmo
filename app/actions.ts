'use server'

import { redirect } from 'next/navigation'
import { unlink } from 'fs/promises'
import { join } from 'path'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { geocodeAddress } from '@/lib/geocode'

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
    kanton: (formData.get('kanton') as string) || null,
    aktiv: formData.get('aktiv') !== 'false',
  }
}

async function deleteUploadedFiles(bilder: string[]) {
  for (const url of bilder) {
    if (!url.startsWith('/uploads/')) continue
    await unlink(join(process.cwd(), 'public', url)).catch(() => {})
  }
}

export async function createInserat(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/login?callbackUrl=/inserat-aufgeben')

  const fields = parseInseratFields(formData)
  const coords = await geocodeAddress(fields.strasse, fields.plz, fields.ort)

  const inserat = await prisma.inserat.create({
    data: {
      ...fields,
      // Geocoded canton takes precedence over the manually selected one
      ...(coords?.kanton ? { kanton: coords.kanton } : {}),
      ...coords,
      bilder: formData.getAll('bilder').map(String).filter(Boolean),
      dokumente: formData.getAll('dokumente').map(String).filter(Boolean),
      userId: session.user.id,
    },
  })

  redirect(`/inserate/${inserat.id}`)
}

export async function updateInserat(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/login')

  const id = formData.get('id') as string
  const redirectTo = (formData.get('redirectTo') as string) || `/inserate/${id}`
  const existing = await prisma.inserat.findUnique({
    where: { id },
    select: { userId: true, bilder: true, strasse: true, plz: true, ort: true, kanton: true },
  })
  const isAdmin = session.user.role === 'admin'
  if (!existing || (existing.userId !== session.user.id && !isAdmin)) throw new Error('Nicht autorisiert')

  const fields = parseInseratFields(formData)
  const newBilder = formData.getAll('bilder').map(String).filter(Boolean)
  const newDokumente = formData.getAll('dokumente').map(String).filter(Boolean)
  await deleteUploadedFiles(existing.bilder.filter(b => !newBilder.includes(b)))

  // Re-geocode if address changed; always derive canton from geocoding
  let coords: { lat: number; lng: number; kanton?: string } | null = null
  const addressChanged =
    fields.strasse !== existing.strasse ||
    fields.plz !== existing.plz ||
    fields.ort !== existing.ort
  if (addressChanged) {
    coords = await geocodeAddress(fields.strasse, fields.plz, fields.ort)
  }

  await prisma.inserat.update({
    where: { id },
    data: {
      ...fields,
      // Geocoded canton takes precedence when address was re-geocoded
      ...(coords?.kanton ? { kanton: coords.kanton } : {}),
      bilder: newBilder,
      dokumente: newDokumente,
      ...(coords ? { lat: coords.lat, lng: coords.lng } : {}),
    },
  })

  redirect(redirectTo)
}

export async function deleteInserat(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/login')

  const id = formData.get('id') as string
  const existing = await prisma.inserat.findUnique({ where: { id }, select: { userId: true, bilder: true, dokumente: true } })
  if (!existing || existing.userId !== session.user.id) throw new Error('Nicht autorisiert')

  await deleteUploadedFiles([...existing.bilder, ...existing.dokumente])
  await prisma.inserat.delete({ where: { id } })
  redirect('/meine-inserate?deleted=1')
}
