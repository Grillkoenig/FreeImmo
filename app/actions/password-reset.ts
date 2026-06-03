'use server'

import { randomBytes } from 'crypto'
import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { sendPasswordResetEmail } from '@/lib/mail'

export async function requestPasswordReset(formData: FormData) {
  const email = (formData.get('email') as string)?.trim().toLowerCase()
  if (!email) return { error: 'Bitte E-Mail eingeben.' }

  // Always return success to not leak which emails are registered
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return { success: true }

  // Delete any existing tokens for this email
  await prisma.passwordResetToken.deleteMany({ where: { email } })

  const token = randomBytes(32).toString('hex')
  const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

  await prisma.passwordResetToken.create({ data: { email, token, expires } })

  const baseUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'
  const resetUrl = `${baseUrl}/passwort-zuruecksetzen?token=${token}`

  await sendPasswordResetEmail(email, resetUrl)

  return { success: true }
}

export async function resetPassword(formData: FormData) {
  const token = (formData.get('token') as string)?.trim()
  const password = formData.get('password') as string
  const confirm = formData.get('confirm') as string

  if (!token) return { error: 'Ungültiger Link.' }
  if (!password || password.length < 8) return { error: 'Passwort muss mind. 8 Zeichen haben.' }
  if (password !== confirm) return { error: 'Passwörter stimmen nicht überein.' }

  const record = await prisma.passwordResetToken.findUnique({ where: { token } })

  if (!record) return { error: 'Dieser Link ist ungültig oder bereits verwendet.' }
  if (record.expires < new Date()) return { error: 'Dieser Link ist abgelaufen. Bitte fordere einen neuen an.' }

  const hashed = await bcrypt.hash(password, 12)

  await prisma.user.update({
    where: { email: record.email },
    data: { password: hashed },
  })

  await prisma.passwordResetToken.delete({ where: { token } })

  redirect('/login?reset=1')
}
