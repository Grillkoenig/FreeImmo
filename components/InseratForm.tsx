'use client'

import { useState } from 'react'
import ImageUpload from './ImageUpload'
import PdfUpload from './PdfUpload'
import { createInserat, updateInserat } from '@/app/actions'
import { KANTONE } from '@/lib/kantone'

const inputClass = 'w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1'

type InitialData = {
  id: string
  titel: string
  beschreibung: string
  preis: number
  zimmer: number
  flaeche: number
  strasse: string
  plz: string
  ort: string
  kanton: string | null
  typ: string
  modus: string
  bilder: string[]
  dokumente: string[]
  aktiv: boolean
}

type Props = {
  initialData?: InitialData
}

export default function InseratForm({ initialData }: Props) {
  const isEdit = !!initialData
  const [imageUrls, setImageUrls] = useState<string[]>(initialData?.bilder ?? [])
  const [dokumenteUrls, setDokumenteUrls] = useState<string[]>(initialData?.dokumente ?? [])
  const [aktiv, setAktiv] = useState(initialData?.aktiv ?? true)

  async function handleSubmit(formData: FormData) {
    imageUrls.forEach(url => formData.append('bilder', url))
    dokumenteUrls.forEach(url => formData.append('dokumente', url))
    formData.set('aktiv', String(aktiv))
    if (isEdit) {
      formData.set('id', initialData.id)
      await updateInserat(formData)
    } else {
      await createInserat(formData)
    }
  }

  return (
    <form action={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 space-y-8">

      {/* Art des Inserats */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">Art des Inserats</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="modus" className={labelClass}>Angebot <span style={{ color: 'var(--primary)' }}>*</span></label>
            <select id="modus" name="modus" required defaultValue={initialData?.modus ?? 'mieten'} className={inputClass}>
              <option value="mieten">Zur Miete</option>
              <option value="kaufen">Zum Kauf</option>
            </select>
          </div>
          <div>
            <label htmlFor="typ" className={labelClass}>Objekttyp <span style={{ color: 'var(--primary)' }}>*</span></label>
            <select id="typ" name="typ" required defaultValue={initialData?.typ ?? 'wohnung'} className={inputClass}>
              <option value="wohnung">Wohnung</option>
              <option value="haus">Haus</option>
              <option value="studio">Studio</option>
              <option value="gewerbe">Gewerbe</option>
            </select>
          </div>
        </div>
      </section>

      {/* Bilder */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">Bilder</h2>
        <ImageUpload value={imageUrls} onChange={setImageUrls} maxFiles={10} />
      </section>

      {/* Dokumente */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-1 pb-2 border-b border-gray-100">Dokumente</h2>
        <p className="text-sm text-gray-500 mb-4">Grundriss, Energieausweis, Exposé o.ä. als PDF hochladen.</p>
        <PdfUpload value={dokumenteUrls} onChange={setDokumenteUrls} maxFiles={5} />
      </section>

      {/* Objekt-Details */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">Objekt-Details</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="titel" className={labelClass}>Titel <span style={{ color: 'var(--primary)' }}>*</span></label>
            <input id="titel" name="titel" type="text" required placeholder="z.B. Helle 3.5-Zimmer-Wohnung im Zentrum" defaultValue={initialData?.titel} className={inputClass} />
          </div>
          <div>
            <label htmlFor="beschreibung" className={labelClass}>Beschreibung <span style={{ color: 'var(--primary)' }}>*</span></label>
            <textarea id="beschreibung" name="beschreibung" required rows={5} placeholder="Beschreiben Sie das Objekt, besondere Merkmale, Ausstattung, etc." defaultValue={initialData?.beschreibung} className={inputClass} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="preis" className={labelClass}>Preis (CHF) <span style={{ color: 'var(--primary)' }}>*</span></label>
              <input id="preis" name="preis" type="number" required min="0" placeholder="1800" defaultValue={initialData?.preis} className={inputClass} />
            </div>
            <div>
              <label htmlFor="zimmer" className={labelClass}>Zimmer <span style={{ color: 'var(--primary)' }}>*</span></label>
              <input id="zimmer" name="zimmer" type="number" required min="0.5" step="0.5" placeholder="3.5" defaultValue={initialData?.zimmer} className={inputClass} />
            </div>
            <div>
              <label htmlFor="flaeche" className={labelClass}>Fläche (m²) <span style={{ color: 'var(--primary)' }}>*</span></label>
              <input id="flaeche" name="flaeche" type="number" required min="1" placeholder="85" defaultValue={initialData?.flaeche} className={inputClass} />
            </div>
          </div>
        </div>
      </section>

      {/* Adresse */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">Adresse</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="strasse" className={labelClass}>Strasse & Nr. <span style={{ color: 'var(--primary)' }}>*</span></label>
            <input id="strasse" name="strasse" type="text" required placeholder="Musterstrasse 12" defaultValue={initialData?.strasse} className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="plz" className={labelClass}>PLZ <span style={{ color: 'var(--primary)' }}>*</span></label>
              <input id="plz" name="plz" type="text" required placeholder="8001" maxLength={6} defaultValue={initialData?.plz} className={inputClass} />
            </div>
            <div>
              <label htmlFor="ort" className={labelClass}>Ort <span style={{ color: 'var(--primary)' }}>*</span></label>
              <input id="ort" name="ort" type="text" required placeholder="Zürich" defaultValue={initialData?.ort} className={inputClass} />
            </div>
          </div>
          <div>
            <label htmlFor="kanton" className={labelClass}>Kanton <span style={{ color: 'var(--primary)' }}>*</span></label>
            <select id="kanton" name="kanton" required defaultValue={initialData?.kanton ?? ''} className={inputClass}>
              <option value="">Kanton wählen…</option>
              {KANTONE.map(k => (
                <option key={k.kuerzel} value={k.kuerzel}>{k.kuerzel} – {k.name}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Sichtbarkeit (nur im Edit-Modus) */}
      {isEdit && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">Sichtbarkeit</h2>
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <button
              type="button"
              role="switch"
              aria-checked={aktiv}
              onClick={() => setAktiv(v => !v)}
              className={`relative w-11 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${aktiv ? 'bg-green-500 focus:ring-green-500' : 'bg-gray-300 focus:ring-gray-400'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${aktiv ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
            <span className="text-sm text-gray-700">
              {aktiv ? 'Inserat ist öffentlich sichtbar' : 'Inserat ist deaktiviert (nicht sichtbar)'}
            </span>
          </label>
        </section>
      )}

      <div className="pt-2">
        <button type="submit" className="btn-primary w-full py-3.5 rounded-xl font-semibold text-base">
          {isEdit ? 'Änderungen speichern' : 'Inserat veröffentlichen'}
        </button>
        {!isEdit && (
          <p className="text-xs text-center text-gray-400 mt-3">
            Mit dem Veröffentlichen akzeptieren Sie unsere Nutzungsbedingungen.
          </p>
        )}
      </div>
    </form>
  )
}
