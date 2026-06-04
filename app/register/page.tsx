import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import RegisterForm from './RegisterForm'

export const dynamic = 'force-dynamic'

export default async function RegisterPage() {
  const settings = await prisma.settings.findUnique({ where: { id: 'default' } })
  const registrationEnabled = settings?.registrationEnabled ?? true

  if (!registrationEnabled) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm text-center">
          <Link href="/" className="inline-flex items-center justify-center mb-6">
            <span className="text-3xl font-bold" style={{ color: 'var(--primary)' }}>Free</span>
            <span className="text-3xl font-bold text-gray-900">Immo</span>
          </Link>
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-4V8m0 0V6m0 2h2M12 6H9" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Registrierung gesperrt</h1>
            <p className="text-sm text-gray-500">
              Die Registrierung neuer Konten ist momentan nicht möglich.
              Bitte versuche es später erneut.
            </p>
          </div>
          <p className="text-center text-sm text-gray-500 mt-6">
            Bereits ein Konto?{' '}
            <Link href="/login" className="font-medium hover:underline" style={{ color: 'var(--primary)' }}>
              Anmelden
            </Link>
          </p>
        </div>
      </div>
    )
  }

  return <RegisterForm />
}
