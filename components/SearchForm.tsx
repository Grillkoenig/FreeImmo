'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { KANTONE } from '@/lib/kantone'

type Props = { compact?: boolean }

export default function SearchForm({ compact = false }: Props) {
  const router = useRouter()
  const params = useSearchParams()

  const [ort, setOrt] = useState(params.get('ort') ?? '')
  const [kanton, setKanton] = useState(params.get('kanton') ?? '')
  const [modus, setModus] = useState(params.get('modus') ?? '')
  const [typ, setTyp] = useState(params.get('typ') ?? '')
  const [zimmerMin, setZimmerMin] = useState(params.get('zimmerMin') ?? '')
  const [preisMax, setPreisMax] = useState(params.get('preisMax') ?? '')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const query = new URLSearchParams()
    if (ort) query.set('ort', ort)
    if (kanton) query.set('kanton', kanton)
    if (modus) query.set('modus', modus)
    if (typ) query.set('typ', typ)
    if (zimmerMin) query.set('zimmerMin', zimmerMin)
    if (preisMax) query.set('preisMax', preisMax)
    router.push(`/inserate?${query.toString()}`)
  }

  const inputClass = 'w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition'

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Ort oder PLZ"
          value={ort}
          onChange={e => setOrt(e.target.value)}
          className={inputClass}
        />
        <select value={kanton} onChange={e => setKanton(e.target.value)} className={inputClass}>
          <option value="">Alle Kantone</option>
          {KANTONE.map(k => (
            <option key={k.kuerzel} value={k.kuerzel}>{k.kuerzel} – {k.name}</option>
          ))}
        </select>
        <select value={modus} onChange={e => setModus(e.target.value)} className={inputClass}>
          <option value="">Mieten & Kaufen</option>
          <option value="mieten">Mieten</option>
          <option value="kaufen">Kaufen</option>
        </select>
        <button type="submit" className="btn-primary px-6 py-2.5 rounded-lg font-medium text-sm whitespace-nowrap">
          Suchen
        </button>
      </form>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex gap-1 mb-5">
        {(['', 'mieten', 'kaufen'] as const).map(m => (
          <button
            key={m}
            type="button"
            onClick={() => setModus(m)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              modus === m ? 'text-white' : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
            }`}
            style={modus === m ? { backgroundColor: 'var(--primary)' } : {}}
          >
            {m === '' ? 'Alle' : m === 'mieten' ? 'Mieten' : 'Kaufen'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Ort oder PLZ</label>
          <input
            type="text"
            placeholder="z.B. Zürich, Bern, 8001"
            value={ort}
            onChange={e => setOrt(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Kanton</label>
          <select value={kanton} onChange={e => setKanton(e.target.value)} className={inputClass}>
            <option value="">Alle Kantone</option>
            {KANTONE.map(k => (
              <option key={k.kuerzel} value={k.kuerzel}>{k.kuerzel} – {k.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Objekttyp</label>
          <select value={typ} onChange={e => setTyp(e.target.value)} className={inputClass}>
            <option value="">Alle Typen</option>
            <option value="wohnung">Wohnung</option>
            <option value="haus">Haus</option>
            <option value="studio">Studio</option>
            <option value="gewerbe">Gewerbe</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Zimmer (mind.)</label>
          <select value={zimmerMin} onChange={e => setZimmerMin(e.target.value)} className={inputClass}>
            <option value="">Beliebig</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
          </select>
        </div>

        <div className="sm:col-span-2 lg:col-span-2">
          <label className="block text-xs font-medium text-gray-500 mb-1">Max. Preis (CHF)</label>
          <select value={preisMax} onChange={e => setPreisMax(e.target.value)} className={inputClass}>
            <option value="">Kein Limit</option>
            <option value="1000">1&apos;000</option>
            <option value="1500">1&apos;500</option>
            <option value="2000">2&apos;000</option>
            <option value="3000">3&apos;000</option>
            <option value="4000">4&apos;000</option>
            <option value="5000">5&apos;000</option>
            <option value="10000">10&apos;000</option>
            <option value="500000">500&apos;000</option>
            <option value="1000000">1&apos;000&apos;000</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" className="btn-primary px-8 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Suchen
        </button>
      </div>
    </form>
  )
}
