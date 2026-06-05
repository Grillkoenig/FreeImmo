import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { adminToggleInserat, adminDeleteInserat, adminApproveInserat } from '@/app/admin/actions'
import AdminInserateActions from './actions-ui'

export default async function AdminInseratePage() {
  const inserate = await prisma.inserat.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { email: true } } },
  })

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Inserate</h1>
        <p className="text-gray-500 text-sm mt-1">{inserate.length} total</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-left">
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Inserat</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Anbieter</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Typ / Modus</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Preis</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Prüfung</th>
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
                  <span className="text-gray-600">{{ wohnung: 'Wohnung', haus: 'Haus', studio: 'Studio', studentenwohnung: 'Studentenwohnung', gewerbe: 'Gewerbe' }[i.typ] ?? i.typ}</span>
                  <span className="text-gray-300 mx-1">·</span>
                  <span className="capitalize text-gray-600">{i.modus}</span>
                </td>
                <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                  CHF {i.preis.toLocaleString('de-CH')}
                </td>
                <td className="px-4 py-3">
                  {i.geprueft ? (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      Freigegeben
                    </span>
                  ) : (
                    <form action={adminApproveInserat} className="inline">
                      <input type="hidden" name="id" value={i.id} />
                      <button
                        type="submit"
                        className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 hover:bg-yellow-200 cursor-pointer transition-colors"
                      >
                        Freigeben
                      </button>
                    </form>
                  )}
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
                  <AdminInserateActions
                    id={i.id}
                    titel={i.titel}
                    deleteAction={adminDeleteInserat}
                  />
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
