'use client'

import { useState } from 'react'
import Link from 'next/link'
import { register } from '@/app/actions/auth'

export default function RegisterPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await register(new FormData(e.currentTarget))
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Fehler beim Registrieren'
      // Next.js redirect throws NEXT_REDIRECT — don't catch that as error
      if (msg.includes('NEXT_REDIRECT')) return
      setError(msg)
      setLoading(false)
    }
  }

  const inputClass = 'w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition'
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1'

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center mb-6">
            <span className="text-3xl font-bold" style={{ color: 'var(--primary)' }}>Free</span>
            <span className="text-3xl font-bold text-gray-900">Immo</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Konto erstellen</h1>
          <p className="text-gray-500 text-sm mt-1">Kostenlos registrieren und inserieren</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className={labelClass}>Name (optional)</label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Max Mustermann"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="email" className={labelClass}>
                E-Mail <span style={{ color: 'var(--primary)' }}>*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="deine@email.ch"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="password" className={labelClass}>
                Passwort <span style={{ color: 'var(--primary)' }}>*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="Mind. 8 Zeichen"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="confirm" className={labelClass}>
                Passwort bestätigen <span style={{ color: 'var(--primary)' }}>*</span>
              </label>
              <input
                id="confirm"
                name="confirm"
                type="password"
                required
                autoComplete="new-password"
                placeholder="Passwort wiederholen"
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2.5 rounded-lg font-semibold text-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {loading ? 'Konto erstellen…' : 'Konto erstellen'}
            </button>
          </form>
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
