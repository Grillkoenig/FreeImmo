import Link from 'next/link'
import { prisma } from '@/lib/prisma'

const PAGE_SIZE = 25
const SENSITIVE = new Set(['password', 'token', 'sessionToken', 'access_token', 'refresh_token', 'id_token'])

type Props = { searchParams: Promise<{ table?: string; page?: string }> }

const TABLES = [
  { key: 'user',               label: 'User' },
  { key: 'inserat',            label: 'Inserat' },
  { key: 'inseratView',        label: 'InseratView' },
  { key: 'passwordResetToken', label: 'PasswordResetToken' },
  { key: 'settings',           label: 'Settings' },
]

async function getCounts() {
  const [user, inserat, inseratView, passwordResetToken, settings] =
    await Promise.all([
      prisma.user.count(),
      prisma.inserat.count(),
      prisma.inseratView.count(),
      prisma.passwordResetToken.count(),
      prisma.settings.count(),
    ])
  return { user, inserat, inseratView, passwordResetToken, settings }
}

async function getRows(table: string, page: number): Promise<{ rows: Record<string, unknown>[]; total: number }> {
  const skip = (page - 1) * PAGE_SIZE
  const opts = { skip, take: PAGE_SIZE }

  switch (table) {
    case 'user':
      return { rows: await prisma.user.findMany({ ...opts, orderBy: { createdAt: 'desc' } }) as Record<string, unknown>[], total: await prisma.user.count() }
    case 'inserat':
      return { rows: await prisma.inserat.findMany({ ...opts, orderBy: { createdAt: 'desc' } }) as Record<string, unknown>[], total: await prisma.inserat.count() }
    case 'inseratView':
      return { rows: await prisma.inseratView.findMany({ ...opts, orderBy: { createdAt: 'desc' } }) as Record<string, unknown>[], total: await prisma.inseratView.count() }
    case 'passwordResetToken':
      return { rows: await prisma.passwordResetToken.findMany({ ...opts, orderBy: { createdAt: 'desc' } }) as Record<string, unknown>[], total: await prisma.passwordResetToken.count() }
    case 'settings':
      return { rows: await prisma.settings.findMany({ ...opts }) as Record<string, unknown>[], total: await prisma.settings.count() }
    default:
      return { rows: [], total: 0 }
  }
}

function formatValue(key: string, value: unknown): string {
  if (value === null || value === undefined) return '—'
  if (SENSITIVE.has(key)) return '••••••••'
  if (typeof value === 'boolean') return value ? 'true' : 'false'
  if (value instanceof Date) return value.toISOString().replace('T', ' ').slice(0, 19)
  if (Array.isArray(value)) return value.length === 0 ? '[]' : `[${value.length} Einträge]`
  if (typeof value === 'object') return JSON.stringify(value)
  const str = String(value)
  return str.length > 60 ? str.slice(0, 57) + '…' : str
}

export default async function DatenbankPage({ searchParams }: Props) {
  const { table, page: pageParam } = await searchParams
  const page = Math.max(1, parseInt(pageParam ?? '1', 10))

  const [counts, tableData] = await Promise.all([
    getCounts(),
    table ? getRows(table, page) : Promise.resolve(null),
  ])

  const totalPages = tableData ? Math.ceil(tableData.total / PAGE_SIZE) : 1
  const columns = tableData?.rows[0] ? Object.keys(tableData.rows[0]) : []

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Datenbank</h1>

      {/* Table list */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {TABLES.map(t => {
          const count = counts[t.key as keyof typeof counts]
          const isActive = table === t.key
          return (
            <Link
              key={t.key}
              href={`/admin/datenbank?table=${t.key}`}
              className={`rounded-xl border p-4 transition-all ${
                isActive
                  ? 'border-pink-400 bg-pink-50'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${isActive ? 'text-pink-600' : 'text-gray-400'}`}>
                {t.label}
              </p>
              <p className={`text-2xl font-bold ${isActive ? 'text-pink-700' : 'text-gray-900'}`}>
                {count.toLocaleString('de-CH')}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">Einträge</p>
            </Link>
          )
        })}
      </div>

      {/* Table data */}
      {table && tableData && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="text-sm font-semibold text-gray-900">{TABLES.find(t => t.key === table)?.label}</span>
              <span className="ml-2 text-xs text-gray-400">{tableData.total.toLocaleString('de-CH')} Einträge</span>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center gap-1 text-xs">
                {page > 1 && (
                  <Link href={`/admin/datenbank?table=${table}&page=${page - 1}`} className="px-2 py-1 rounded border border-gray-200 text-gray-600 hover:bg-gray-50">
                    ←
                  </Link>
                )}
                <span className="px-2 py-1 text-gray-500">Seite {page} / {totalPages}</span>
                {page < totalPages && (
                  <Link href={`/admin/datenbank?table=${table}&page=${page + 1}`} className="px-2 py-1 rounded border border-gray-200 text-gray-600 hover:bg-gray-50">
                    →
                  </Link>
                )}
              </div>
            )}
          </div>

          {tableData.rows.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-12">Keine Einträge vorhanden.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {columns.map(col => (
                      <th key={col} className="px-4 py-2.5 text-left font-semibold text-gray-500 whitespace-nowrap">
                        {col}
                        {SENSITIVE.has(col) && (
                          <span className="ml-1 text-gray-300 font-normal">🔒</span>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {tableData.rows.map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      {columns.map(col => {
                        const val = formatValue(col, row[col])
                        const isMasked = SENSITIVE.has(col)
                        return (
                          <td
                            key={col}
                            className={`px-4 py-2.5 font-mono whitespace-nowrap max-w-[200px] truncate ${
                              isMasked ? 'text-gray-300' : 'text-gray-700'
                            }`}
                            title={isMasked ? '' : String(row[col] ?? '')}
                          >
                            {val}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {!table && (
        <p className="text-sm text-gray-400 text-center py-8">Tabelle oben auswählen um Einträge anzuzeigen.</p>
      )}
    </div>
  )
}
