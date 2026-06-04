'use server'

import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function register(formData: FormData) {
  const settings = await prisma.settings.findUnique({ where: { id: 'default' } })
  if (settings?.registrationEnabled === false) throw new Error('Die Registrierung ist derzeit gesperrt')

  const name = (formData.get('name') as string)?.trim()
  const email = (formData.get('email') as string)?.trim().toLowerCase()
  const password = formData.get('password') as string
  const confirm = formData.get('confirm') as string

  if (!email || !password) throw new Error('Alle Felder ausfüllen')
  if (password.length < 8) throw new Error('Passwort muss mind. 8 Zeichen haben')
  if (password !== confirm) throw new Error('Passwörter stimmen nicht überein')

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) throw new Error('Diese E-Mail ist bereits registriert')

  const hashed = await bcrypt.hash(password, 12)
  await prisma.user.create({
    data: { name: name || null, email, password: hashed },
  })

  redirect('/login?registered=1')
}
