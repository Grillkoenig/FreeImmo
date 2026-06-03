export async function geocodeAddress(
  strasse: string,
  plz: string,
  ort: string
): Promise<{ lat: number; lng: number } | null> {
  const q = encodeURIComponent(`${strasse}, ${plz} ${ort}, Schweiz`)
  const url = `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1&countrycodes=ch`

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'FreeImmo/1.0 (freeimmo.ch)' },
      next: { revalidate: 0 },
    })
    if (!res.ok) return null
    const data = await res.json()
    if (!data.length) return null
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
  } catch {
    return null
  }
}
