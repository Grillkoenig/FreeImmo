'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const KANTONS = ['Zürich', 'Bern', 'Basel', 'Genf', 'Lausanne', 'Luzern', 'St. Gallen', 'Winterthur']

type Props = {
  total: number
  orteCount: number
}

function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0)
  const started = useRef(false)
  useEffect(() => {
    if (started.current) return
    started.current = true
    const steps = 40
    const step = target / steps
    let current = 0
    const id = setInterval(() => {
      current = Math.min(current + step, target)
      setValue(Math.round(current))
      if (current >= target) clearInterval(id)
    }, duration / steps)
    return () => clearInterval(id)
  }, [target, duration])
  return value
}

export default function HomeHero({ total, orteCount }: Props) {
  const router = useRouter()
  const [modus, setModus] = useState<'alle' | 'mieten' | 'kaufen'>('alle')
  const [ort, setOrt] = useState('')
  const [typ, setTyp] = useState('')
  const countInserate = useCountUp(total)
  const countOrte = useCountUp(orteCount)

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const q = new URLSearchParams()
    if (modus !== 'alle') q.set('modus', modus)
    if (ort.trim()) q.set('ort', ort.trim())
    if (typ) q.set('typ', typ)
    router.push(`/inserate?${q}`)
  }

  const modusBtn = (label: string, value: typeof modus) => (
    <button
      type="button"
      onClick={() => setModus(value)}
      className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-150 active:scale-95 ${
        modus === value
          ? 'text-white shadow-md'
          : 'text-white/70 hover:text-white hover:bg-white/10'
      }`}
      style={modus === value ? { backgroundColor: 'var(--primary)' } : {}}
    >
      {label}
    </button>
  )

  return (
    <>
      {/* Hero */}
      <section
        className="relative py-20 px-4"
        style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Dein neues Zuhause<br />
            <span style={{ color: 'var(--primary)' }}>wartet auf dich</span>
          </h1>
          <p className="text-gray-300 text-lg mb-8">
            {total} Inserate in {orteCount} Orten in der Schweiz
          </p>

          {/* Search card */}
          <div className="bg-white rounded-2xl shadow-xl p-5">
            {/* Modus tabs */}
            <div className="flex gap-1 mb-4 bg-gray-900 rounded-xl p-1 w-fit">
              {modusBtn('Alle', 'alle')}
              {modusBtn('Mieten', 'mieten')}
              {modusBtn('Kaufen', 'kaufen')}
            </div>

            <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="relative sm:col-span-1">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Ort oder PLZ"
                  value={ort}
                  onChange={e => setOrt(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
                />
              </div>

              <select
                value={typ}
                onChange={e => setTyp(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition bg-white"
              >
                <option value="">Alle Objekttypen</option>
                <option value="wohnung">Wohnung</option>
                <option value="haus">Haus</option>
                <option value="studio">Studio</option>
                <option value="gewerbe">Gewerbe</option>
              </select>

              <button
                type="submit"
                className="btn-primary w-full py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Suchen
              </button>
            </form>

            {/* Quick links */}
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
              <span className="text-xs text-gray-400 self-center">Schnellsuche:</span>
              {[
                { label: '2+ Zimmer', href: '/inserate?zimmerMin=2' },
                { label: '4+ Zimmer', href: '/inserate?zimmerMin=4' },
                { label: 'Mieten bis 2000', href: '/inserate?modus=mieten&preisMax=2000' },
                { label: 'Auf Karte', href: '/inserate?ansicht=karte' },
              ].map(q => (
                <Link
                  key={q.href}
                  href={q.href}
                  className="text-xs px-2.5 py-1 rounded-full border border-gray-200 text-gray-600 hover:border-gray-400 hover:bg-gray-50 active:scale-95 transition-all"
                >
                  {q.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="max-w-4xl mx-auto mt-8 grid grid-cols-3 gap-4 text-center">
          <Link
            href="/inserate"
            className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 active:scale-95 transition-all cursor-pointer group"
          >
            <p className="text-2xl font-bold text-white group-hover:text-pink-300 transition-colors">{countInserate}</p>
            <p className="text-gray-300 text-sm mt-1">Inserate</p>
          </Link>
          <Link
            href="/inserate?ansicht=karte"
            className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 active:scale-95 transition-all cursor-pointer group"
          >
            <p className="text-2xl font-bold text-white group-hover:text-pink-300 transition-colors">{countOrte}</p>
            <p className="text-gray-300 text-sm mt-1">Städte</p>
          </Link>
          <Link
            href="/inserat-aufgeben"
            className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 active:scale-95 transition-all cursor-pointer group"
          >
            <p className="text-2xl font-bold text-white group-hover:text-pink-300 transition-colors">100%</p>
            <p className="text-gray-300 text-sm mt-1">Kostenlos</p>
          </Link>
        </div>
      </section>

      {/* City chips */}
      <section className="py-10 px-4 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-sm font-medium text-gray-500 mb-4">Beliebte Städte</h2>
          <div className="flex flex-wrap gap-2">
            {KANTONS.map(k => (
              <Link
                key={k}
                href={`/inserate?ort=${encodeURIComponent(k)}`}
                className="px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-700 hover:border-pink-400 hover:text-pink-600 hover:bg-pink-50 active:scale-95 transition-all"
              >
                {k}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
