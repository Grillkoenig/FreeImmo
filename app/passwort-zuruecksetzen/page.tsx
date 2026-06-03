'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { resetPassword } from '@/app/actions/password-reset'

function ResetForm() {
  const params = useSearchParams()
  const token = params.get('token') ?? ''

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const passwordStrength = getStrength(password)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirm) {
      setError('Passwörter stimmen nicht überein.')
      return
    }

    setLoading(true)
    const fd = new FormData()
    fd.set('token', token)
    fd.set('password', password)
    fd.set('confirm', confirm)

    try {
      await resetPassword(fd)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Fehler'
      if (msg.includes('NEXT_REDIRECT')) return
      setError(msg)
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 font-medium">Ungültiger oder fehlender Reset-Link.</p>
        <Link href="/passwort-vergessen" className="mt-4 inline-block text-sm font-medium" style={{ color: 'var(--primary)' }}>
          Neuen Link anfordern
        </Link>
      </div>
    )
  }

  const inputClass = 'w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition pr-10'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-start gap-2">
          <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>
            {error}{' '}
            {error.includes('abgelaufen') && (
              <Link href="/passwort-vergessen" className="underline font-medium" style={{ color: 'var(--primary)' }}>
                Neuen Link anfordern
              </Link>
            )}
          </span>
        </div>
      )}

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Neues Passwort
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="Mind. 8 Zeichen"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className={inputClass}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>

        {password.length > 0 && (
          <div className="mt-2 space-y-1">
            <div className="flex gap-1">
              {[1, 2, 3, 4].map(i => (
                <div
                  key={i}
                  className="h-1 flex-1 rounded-full transition-colors duration-200"
                  style={{ backgroundColor: i <= passwordStrength.score ? passwordStrength.color : '#e5e7eb' }}
                />
              ))}
            </div>
            <p className="text-xs" style={{ color: passwordStrength.color }}>
              {passwordStrength.label}
            </p>
          </div>
        )}
      </div>

      <div>
        <label htmlFor="confirm" className="block text-sm font-medium text-gray-700 mb-1">
          Passwort bestätigen
        </label>
        <div className="relative">
          <input
            id="confirm"
            type={showPassword ? 'text' : 'password'}
            required
            autoComplete="new-password"
            placeholder="Passwort wiederholen"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            className={inputClass}
          />
          {confirm.length > 0 && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2">
              {password === confirm ? (
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </span>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || passwordStrength.score < 2}
        className="btn-primary w-full py-2.5 rounded-lg font-semibold text-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading && (
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {loading ? 'Speichern…' : 'Neues Passwort speichern'}
      </button>
    </form>
  )
}

function getStrength(pw: string): { score: number; label: string; color: string } {
  if (pw.length === 0) return { score: 0, label: '', color: '' }
  let score = 0
  if (pw.length >= 8) score++
  if (pw.length >= 12) score++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++
  if (/[0-9]/.test(pw) || /[^a-zA-Z0-9]/.test(pw)) score++

  const levels = [
    { score: 1, label: 'Sehr schwach', color: '#ef4444' },
    { score: 2, label: 'Schwach', color: '#f97316' },
    { score: 3, label: 'Gut', color: '#eab308' },
    { score: 4, label: 'Stark', color: '#22c55e' },
  ]
  return levels[score - 1] ?? levels[0]
}

export default function PasswortZuruecksetzenPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center mb-6">
            <span className="text-3xl font-bold" style={{ color: 'var(--primary)' }}>Free</span>
            <span className="text-3xl font-bold text-gray-900">Immo</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Neues Passwort</h1>
          <p className="text-gray-500 text-sm mt-1">Wähle ein sicheres Passwort.</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <Suspense>
            <ResetForm />
          </Suspense>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          <Link href="/login" className="font-medium hover:underline inline-flex items-center gap-1" style={{ color: 'var(--primary)' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Zurück zur Anmeldung
          </Link>
        </p>
      </div>
    </div>
  )
}
