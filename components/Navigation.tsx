'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { data: session, status } = useSession()

  const initials = session?.user?.name
    ? session.user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : session?.user?.email?.[0].toUpperCase() ?? '?'

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-0.5">
            <span className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>Free</span>
            <span className="text-2xl font-bold text-gray-900">Immo</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/inserate" className="text-gray-600 hover:text-gray-900 font-medium text-sm">
              Inserate
            </Link>
            <Link href="/inserate?modus=mieten" className="text-gray-600 hover:text-gray-900 font-medium text-sm">
              Mieten
            </Link>
            <Link href="/inserate?modus=kaufen" className="text-gray-600 hover:text-gray-900 font-medium text-sm">
              Kaufen
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/inserat-aufgeben" className="btn-primary px-4 py-2 rounded-lg font-medium text-sm">
              Inserat aufgeben
            </Link>

            {status === 'loading' ? (
              <div className="w-9 h-9 rounded-full bg-gray-100 animate-pulse" />
            ) : session ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2"
                  style={{ backgroundColor: 'var(--primary)', '--tw-ring-color': 'var(--primary)' } as React.CSSProperties}
                >
                  {initials}
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl border border-gray-200 shadow-lg py-1 z-50">
                      <div className="px-4 py-2.5 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {session.user.name ?? 'Mein Konto'}
                          </p>
                          {session.user.role === 'admin' && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide text-white" style={{ backgroundColor: 'var(--primary)' }}>
                              Admin
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 truncate">{session.user.email}</p>
                      </div>
                      {session.user.role === 'admin' && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Admin-Bereich
                        </Link>
                      )}
                      <Link
                        href="/meine-inserate"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Meine Inserate
                      </Link>
                      <button
                        onClick={() => { setUserMenuOpen(false); signOut({ callbackUrl: '/' }) }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Abmelden
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2">
                  Anmelden
                </Link>
                <Link href="/register" className="text-sm font-medium text-gray-700 border border-gray-300 hover:border-gray-400 px-3 py-2 rounded-lg transition-colors">
                  Registrieren
                </Link>
              </div>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menü öffnen"
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 flex flex-col gap-1">
            <Link href="/inserate" className="text-gray-700 font-medium py-2.5 border-b border-gray-100" onClick={() => setMenuOpen(false)}>Alle Inserate</Link>
            <Link href="/inserate?modus=mieten" className="text-gray-700 font-medium py-2.5 border-b border-gray-100" onClick={() => setMenuOpen(false)}>Mieten</Link>
            <Link href="/inserate?modus=kaufen" className="text-gray-700 font-medium py-2.5 border-b border-gray-100" onClick={() => setMenuOpen(false)}>Kaufen</Link>
            {session ? (
              <>
                <Link href="/meine-inserate" className="text-gray-700 font-medium py-2.5 border-b border-gray-100" onClick={() => setMenuOpen(false)}>Meine Inserate</Link>
                <button onClick={() => { setMenuOpen(false); signOut({ callbackUrl: '/' }) }} className="text-left text-gray-700 font-medium py-2.5 border-b border-gray-100">Abmelden</button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 font-medium py-2.5 border-b border-gray-100" onClick={() => setMenuOpen(false)}>Anmelden</Link>
                <Link href="/register" className="text-gray-700 font-medium py-2.5 border-b border-gray-100" onClick={() => setMenuOpen(false)}>Registrieren</Link>
              </>
            )}
            <div className="pt-2">
              <Link href="/inserat-aufgeben" className="btn-primary block px-4 py-2.5 rounded-lg font-medium text-sm text-center" onClick={() => setMenuOpen(false)}>
                Inserat aufgeben
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
