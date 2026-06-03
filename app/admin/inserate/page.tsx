import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { adminToggleInserat, adminDeleteInserat } from '@/app/admin/actions'

export default async function AdminInseratePage() {
  const inserate = await prisma.inserat.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { email: true } } },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inserate</h1>
          <p className="text-gray-500 text-sm mt-1">{inserate.length} total</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-left">
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Inserat</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Anbieter</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Typ / Modus</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Preis</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Aktionen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {inserate.map(i => (
              <tr key={i.id} className={`hover:bg-gray-50 transition-colors ${!i.aktiv ? 'opacity-50' : ''}`}>
                <td className="px-4 py-3">
                  <Link href={`/inserate/${i.id}`} className="font-medium text-gray-900 hover:underline line-clamp-1 max-w-[200px] block">
                    {i.titel}
                  </Link>
                  <p className="text-xs text-gray-400">{i.plz} {i.ort}</p>
                </td>
                <td className="px-4 py-3 text-gray-500 hidden md:table-cell max-w-[160px] truncate">
                  {i.user.email}
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <span className="capitalize text-gray-600">{i.typ}</span>
                  <span className="text-gray-300 mx-1">·</span>
                  <span className="capitalize text-gray-600">{i.modus}</span>
                </td>
                <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                  CHF {i.preis.toLocaleString('de-CH')}
                </td>
                <td className="px-4 py-3">
                  <form action={adminToggleInserat}>
                    <input type="hidden" name="id" value={i.id} />
                    <button
                      type="submit"
                      className={`px-2 py-0.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                        i.aktiv
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {i.aktiv ? 'Aktiv' : 'Inaktiv'}
                    </button>
                  </form>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/inserate/${i.id}/bearbeiten`}
                      className="text-xs text-gray-500 hover:text-gray-900 border border-gray-200 rounded px-2 py-1 hover:bg-gray-50"
                    >
                      Bearbeiten
                    </Link>
                    <AdminDeleteInseratButton id={i.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {inserate.length === 0 && (
          <p className="text-center text-gray-400 py-12 text-sm">Keine Inserate vorhanden.</p>
        )}
      </div>
    </div>
  )
}

function AdminDeleteInseratButton({ id }: { id: string }) {
  return (
    <form action={adminDeleteInserat}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="text-xs text-red-600 border border-red-200 rounded px-2 py-1 hover:bg-red-50 transition-colors"
        onClick={e => {
          if (!confirm('Inserat wirklich löschen?')) e.preventDefault()
        }}
      >
        Löschen
      </button>
    </form>
  )
}
