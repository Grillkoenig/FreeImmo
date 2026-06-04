import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import InseratForm from '@/components/InseratForm'

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ from?: string }> }

export default async function InseratBearbeitenPage({ params, searchParams }: Props) {
  const { id } = await params
  const { from } = await searchParams
  const session = await getServerSession(authOptions)
  if (!session) redirect(`/login?callbackUrl=/inserate/${id}/bearbeiten`)

  const inserat = await prisma.inserat.findUnique({ where: { id } })
  if (!inserat) notFound()

  const isAdmin = session.user.role === 'admin'
  if (inserat.userId !== session.user.id && !isAdmin) {
    redirect('/meine-inserate')
  }

  const fromAdmin = from === 'admin' || isAdmin && inserat.userId !== session.user.id
  const backHref = fromAdmin ? '/admin/inserate' : `/inserate/${id}`
  const redirectTo = fromAdmin ? '/admin/inserate' : undefined

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Link
          href={backHref}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Zurück"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inserat bearbeiten</h1>
          <p className="text-gray-500 text-sm mt-0.5 truncate max-w-sm">{inserat.titel}</p>
        </div>
      </div>

      <InseratForm
        initialData={{
          id: inserat.id,
          titel: inserat.titel,
          beschreibung: inserat.beschreibung,
          preis: inserat.preis,
          zimmer: inserat.zimmer,
          flaeche: inserat.flaeche,
          strasse: inserat.strasse,
          plz: inserat.plz,
          ort: inserat.ort,
          kanton: inserat.kanton,
          typ: inserat.typ,
          modus: inserat.modus,
          bilder: inserat.bilder,
          dokumente: inserat.dokumente,
          aktiv: inserat.aktiv,
        }}
        redirectTo={redirectTo}
      />
    </div>
  )
}
