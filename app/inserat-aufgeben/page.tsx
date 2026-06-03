import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import InseratForm from '@/components/InseratForm'

export default async function InseratAufgebenPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login?callbackUrl=/inserat-aufgeben')

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Inserat aufgeben</h1>
        <p className="text-gray-500 mt-2">
          Angemeldet als <span className="font-medium text-gray-700">{session.user.email}</span>
        </p>
      </div>
      <InseratForm />
    </div>
  )
}
