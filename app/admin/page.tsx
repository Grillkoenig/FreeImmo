import { prisma } from '@/lib/prisma'
import { adminToggleRegistration } from '@/app/admin/actions'

async function getStats() {
  const [
    totalUsers,
    totalInserate,
    activeInserate,
    ausstehend,
    inserateByTyp,
    inserateByModus,
    newUsersLast7,
    newInserateLast7,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.inserat.count(),
    prisma.inserat.count({ where: { aktiv: true } }),
    prisma.inserat.count({ where: { geprueft: false } }),
    prisma.inserat.groupBy({ by: ['typ'], _count: { _all: true } }),
    prisma.inserat.groupBy({ by: ['modus'], _count: { _all: true } }),
    prisma.user.count({ where: { createdAt: { gte: new Date(Date.now() - 7 * 864e5) } } }),
    prisma.inserat.count({ where: { createdAt: { gte: new Date(Date.now() - 7 * 864e5) } } }),
  ])

  return { totalUsers, totalInserate, activeInserate, ausstehend, inserateByTyp, inserateByModus, newUsersLast7, newInserateLast7 }
}

async function getRecent() {
  const [recentInserate, recentUsers] = await Promise.all([
    prisma.inserat.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, titel: true, ort: true, modus: true, aktiv: true, createdAt: true, user: { select: { email: true } } },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, email: true, name: true, role: true, createdAt: true, _count: { select: { inserate: true } } },
    }),
  ])
  return { recentInserate, recentUsers }
}

export default async function AdminDashboard() {
  const [stats, recent, settings] = await Promise.all([
    getStats(),
    getRecent(),
    prisma.settings.findUnique({ where: { id: 'default' } }),
  ])
  const registrationEnabled = settings?.registrationEnabled ?? true

  const statCards = [
    { label: 'Benutzer gesamt', value: stats.totalUsers, sub: `+${stats.newUsersLast7} diese Woche`, color: 'bg-blue-50 text-blue-700' },
    { label: 'Inserate gesamt', value: stats.totalInserate, sub: `+${stats.newInserateLast7} diese Woche`, color: 'bg-purple-50 text-purple-700' },
    { label: 'Aktive Inserate', value: stats.activeInserate, sub: `${stats.totalInserate - stats.activeInserate} inaktiv`, color: 'bg-green-50 text-green-700' },
    { label: 'Ausstehend', value: stats.ausstehend, sub: 'Warten auf Freigabe', color: 'bg-yellow-50 text-yellow-700' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin-Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Plattform-Übersicht</p>
      </div>

      {/* Quick settings */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-900">Registrierung neuer Benutzer</p>
          <p className={`text-xs mt-0.5 ${registrationEnabled ? 'text-green-600' : 'text-red-600'}`}>
            {registrationEnabled ? 'Geöffnet — neue Konten können erstellt werden' : 'Gesperrt — neue Konten sind deaktiviert'}
          </p>
        </div>
        <form action={adminToggleRegistration}>
          <button
            type="submit"
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              registrationEnabled ? 'bg-green-500 focus:ring-green-500' : 'bg-gray-300 focus:ring-gray-400'
            }`}
            role="switch"
            aria-checked={registrationEnabled}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
              registrationEnabled ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </form>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(c => (
          <div key={c.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500">{c.label}</p>
            <p className={`text-3xl font-bold mt-1 ${c.color.split(' ')[1]}`}>{c.value}</p>
            <p className="text-xs text-gray-400 mt-1">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Inserate nach Typ</h3>
          <div className="space-y-2">
            {stats.inserateByTyp.map(t => (
              <div key={t.typ} className="flex items-center justify-between text-sm">
                <span className="text-gray-600 capitalize">{t.typ}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-100 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full"
                      style={{ width: `${(t._count._all / stats.totalInserate) * 100}%`, backgroundColor: 'var(--primary)' }}
                    />
                  </div>
                  <span className="font-medium text-gray-900 w-4 text-right">{t._count._all}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Inserate nach Modus</h3>
          <div className="space-y-2">
            {stats.inserateByModus.map(m => (
              <div key={m.modus} className="flex items-center justify-between text-sm">
                <span className="text-gray-600 capitalize">{m.modus}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-100 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full bg-blue-500"
                      style={{ width: `${(m._count._all / stats.totalInserate) * 100}%` }}
                    />
                  </div>
                  <span className="font-medium text-gray-900 w-4 text-right">{m._count._all}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">Neueste Inserate</h3>
            <a href="/admin/inserate" className="text-xs font-medium" style={{ color: 'var(--primary)' }}>Alle →</a>
          </div>
          <div className="divide-y divide-gray-100">
            {recent.recentInserate.map(i => (
              <div key={i.id} className="px-5 py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{i.titel}</p>
                  <p className="text-xs text-gray-400">{i.ort} · {i.user.email}</p>
                </div>
                <span className={`flex-shrink-0 w-2 h-2 rounded-full ${i.aktiv ? 'bg-green-400' : 'bg-gray-300'}`} />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">Neueste Benutzer</h3>
            <a href="/admin/benutzer" className="text-xs font-medium" style={{ color: 'var(--primary)' }}>Alle →</a>
          </div>
          <div className="divide-y divide-gray-100">
            {recent.recentUsers.map(u => (
              <div key={u.id} className="px-5 py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{u.email}</p>
                  <p className="text-xs text-gray-400">{u._count.inserate} Inserate</p>
                </div>
                <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${
                  u.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
