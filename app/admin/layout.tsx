import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

const NAV = [
  { href: '/admin', label: 'Übersicht' },
  { href: '/admin/inserate', label: 'Inserate' },
  { href: '/admin/benutzer', label: 'Benutzer' },
  { href: '/admin/einstellungen', label: 'Einstellungen' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  if (!session) redirect('/login?callbackUrl=/admin')
  if (session.user.role !== 'admin') redirect('/')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin topbar */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">Admin</span>
              <span className="text-gray-700">·</span>
              <span className="text-sm font-medium"style={{ color: 'var(--primary)' }}>FreeImmo</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span>{session.user.email}</span>
              <Link href="/" className="hover:text-white transition-colors">← Zur Website</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Admin subnav */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-1">
            {NAV.map(({ href, label }) => (
              <AdminNavLink key={href} href={href} label={label} />
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  )
}

// Separate component so we can use pathname — but layout is a Server Component.
// We use a simple Link; active state is handled client-side in a wrapper.
function AdminNavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300 transition-colors"
    >
      {label}
    </Link>
  )
}
