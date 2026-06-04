import { KANTONE } from './kantone'

// Nominatim can return canton names in German, French, Italian, or Romansh
const STATE_ALIASES: Record<string, string> = {
  // French names
  'Fribourg': 'FR',
  'Vaud': 'VD',
  'Valais': 'VS',
  'Genève': 'GE',
  'Geneva': 'GE',
  'Neuchâtel': 'NE',
  // Italian names
  'Ticino': 'TI',
  'Grigioni': 'GR',
  // Romansh
  'Grischun': 'GR',
  // English
  'Basel-City': 'BS',
  'Basel-Country': 'BL',
}

function stateToKanton(state: string | undefined): string | null {
  if (!state) return null
  // Try exact match against German names in KANTONE
  const found = KANTONE.find(k => k.name === state)
  if (found) return found.kuerzel
  // Try aliases
  return STATE_ALIASES[state] ?? null
}

export async function geocodeAddress(
  strasse: string,
  plz: string,
  ort: string
): Promise<{ lat: number; lng: number; kanton?: string } | null> {
  const q = encodeURIComponent(`${strasse}, ${plz} ${ort}, Schweiz`)
  const url = `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1&countrycodes=ch&addressdetails=1&accept-language=de`

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'FreeImmo/1.0 (freeimmo.ch)' },
      next: { revalidate: 0 },
    })
    if (!res.ok) return null
    const data = await res.json()
    if (!data.length) return null

    const kanton = stateToKanton(data[0].address?.state) ?? undefined

    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
      ...(kanton ? { kanton } : {}),
    }
  } catch {
    return null
  }
}
