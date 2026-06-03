import { prisma } from '@/lib/prisma'
import { adminSetRole, adminDeleteUser } from '@/app/admin/actions'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export default async function AdminBenutzerPage() {
  const [users, session] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { inserate: true } } },
    }),
    getServerSession(authOptions),
  ])

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Benutzer</h1>
        <p className="text-gray-500 text-sm mt-1">{users.length} registriert</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-left">
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Benutzer</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Registriert</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Inserate</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Rolle</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Aktionen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map(u => {
              const isSelf = u.email === session?.user?.email
              return (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
                        style={{ backgroundColor: u.role === 'admin' ? '#e8003d' : '#6b7280' }}
                      >
                        {(u.name ?? u.email).charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate max-w-[180px]">{u.name ?? '–'}</p>
                        <p className="text-xs text-gray-400 truncate max-w-[180px]">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell whitespace-nowrap">
                    {new Date(u.createdAt).toLocaleDateString('de-CH')}
                  </td>
                  <td className="px-4 py-3 text-gray-700 font-medium">
                    {u._count.inserate}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      u.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {!isSelf && (
                        <>
                          <form action={adminSetRole}>
                            <input type="hidden" name="id" value={u.id} />
                            <input type="hidden" name="role" value={u.role === 'admin' ? 'user' : 'admin'} />
                            <button
                              type="submit"
                              className="text-xs text-blue-600 border border-blue-200 rounded px-2 py-1 hover:bg-blue-50 transition-colors whitespace-nowrap"
                            >
                              {u.role === 'admin' ? '→ User' : '→ Admin'}
                            </button>
                          </form>
                          <form action={adminDeleteUser}>
                            <input type="hidden" name="id" value={u.id} />
                            <button
                              type="submit"
                              className="text-xs text-red-600 border border-red-200 rounded px-2 py-1 hover:bg-red-50 transition-colors"
                              onClick={e => {
                                if (!confirm(`Benutzer «${u.email}» und alle ${u._count.inserate} Inserate wirklich löschen?`)) e.preventDefault()
                              }}
                            >
                              Löschen
                            </button>
                          </form>
                        </>
                      )}
                      {isSelf && (
                        <span className="text-xs text-gray-400 italic">Du selbst</span>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {users.length === 0 && (
          <p className="text-center text-gray-400 py-12 text-sm">Keine Benutzer gefunden.</p>
        )}
      </div>
    </div>
  )
}
