'use server'

import { revalidatePath } from 'next/cache'
import { unlink } from 'fs/promises'
import { join } from 'path'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'admin') throw new Error('Nicht autorisiert')
  return session
}

async function deleteFiles(bilder: string[]) {
  for (const url of bilder) {
    if (!url.startsWith('/uploads/')) continue
    await unlink(join(process.cwd(), 'public', url)).catch(() => {})
  }
}

export async function adminToggleInserat(formData: FormData) {
  await requireAdmin()
  const id = formData.get('id') as string
  const inserat = await prisma.inserat.findUnique({ where: { id }, select: { aktiv: true } })
  if (!inserat) return
  await prisma.inserat.update({ where: { id }, data: { aktiv: !inserat.aktiv } })
  revalidatePath('/admin/inserate')
}

export async function adminApproveInserat(formData: FormData) {
  await requireAdmin()
  const id = formData.get('id') as string
  await prisma.inserat.update({ where: { id }, data: { geprueft: true } })
  revalidatePath('/admin/inserate')
}

export async function adminDeleteInserat(formData: FormData) {
  await requireAdmin()
  const id = formData.get('id') as string
  const inserat = await prisma.inserat.findUnique({ where: { id }, select: { bilder: true } })
  if (!inserat) return
  await deleteFiles(inserat.bilder)
  await prisma.inserat.delete({ where: { id } })
  revalidatePath('/admin/inserate')
}

export async function adminSetRole(formData: FormData) {
  await requireAdmin()
  const id = formData.get('id') as string
  const role = formData.get('role') as string
  if (!['user', 'admin'].includes(role)) return
  await prisma.user.update({ where: { id }, data: { role } })
  revalidatePath('/admin/benutzer')
}

export async function adminDeleteUser(formData: FormData) {
  await requireAdmin()
  const id = formData.get('id') as string

  const inserate = await prisma.inserat.findMany({ where: { userId: id }, select: { bilder: true } })
  for (const i of inserate) await deleteFiles(i.bilder)

  await prisma.user.delete({ where: { id } })
  revalidatePath('/admin/benutzer')
}

export async function adminToggleUserSperre(formData: FormData) {
  await requireAdmin()
  const id = formData.get('id') as string
  const user = await prisma.user.findUnique({ where: { id }, select: { gesperrt: true } })
  if (!user) return
  const gesperrt = !user.gesperrt
  await prisma.user.update({ where: { id }, data: { gesperrt } })
  if (gesperrt) {
    // Sperren: Originalstatus sichern, dann alle deaktivieren
    const inserate = await prisma.inserat.findMany({ where: { userId: id }, select: { id: true, aktiv: true } })
    await Promise.all(inserate.map(i =>
      prisma.inserat.update({ where: { id: i.id }, data: { aktivVorSperre: i.aktiv, aktiv: false } })
    ))
  } else {
    // Entsperren: Originalstatus wiederherstellen
    const inserate = await prisma.inserat.findMany({ where: { userId: id }, select: { id: true, aktivVorSperre: true } })
    await Promise.all(inserate.map(i =>
      prisma.inserat.update({ where: { id: i.id }, data: { aktiv: i.aktivVorSperre ?? false, aktivVorSperre: null } })
    ))
  }
  revalidatePath('/admin/benutzer')
}

export async function adminToggleRegistration() {
  await requireAdmin()
  const current = await prisma.settings.findUnique({ where: { id: 'default' } })
  const enabled = current?.registrationEnabled ?? true
  await prisma.settings.upsert({
    where: { id: 'default' },
    create: { id: 'default', registrationEnabled: !enabled },
    update: { registrationEnabled: !enabled },
  })
  revalidatePath('/admin/einstellungen')
}
