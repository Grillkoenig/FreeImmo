export const KANTONE = [
  { kuerzel: 'AG', name: 'Aargau' },
  { kuerzel: 'AI', name: 'Appenzell Innerrhoden' },
  { kuerzel: 'AR', name: 'Appenzell Ausserrhoden' },
  { kuerzel: 'BE', name: 'Bern' },
  { kuerzel: 'BL', name: 'Basel-Landschaft' },
  { kuerzel: 'BS', name: 'Basel-Stadt' },
  { kuerzel: 'FR', name: 'Freiburg' },
  { kuerzel: 'GE', name: 'Genf' },
  { kuerzel: 'GL', name: 'Glarus' },
  { kuerzel: 'GR', name: 'Graubünden' },
  { kuerzel: 'JU', name: 'Jura' },
  { kuerzel: 'LU', name: 'Luzern' },
  { kuerzel: 'NE', name: 'Neuenburg' },
  { kuerzel: 'NW', name: 'Nidwalden' },
  { kuerzel: 'OW', name: 'Obwalden' },
  { kuerzel: 'SG', name: 'St. Gallen' },
  { kuerzel: 'SH', name: 'Schaffhausen' },
  { kuerzel: 'SO', name: 'Solothurn' },
  { kuerzel: 'SZ', name: 'Schwyz' },
  { kuerzel: 'TG', name: 'Thurgau' },
  { kuerzel: 'TI', name: 'Tessin' },
  { kuerzel: 'UR', name: 'Uri' },
  { kuerzel: 'VD', name: 'Waadt' },
  { kuerzel: 'VS', name: 'Wallis' },
  { kuerzel: 'ZG', name: 'Zug' },
  { kuerzel: 'ZH', name: 'Zürich' },
] as const

export type KantonKuerzel = (typeof KANTONE)[number]['kuerzel']

export function getKantonName(kuerzel: string): string {
  return KANTONE.find(k => k.kuerzel === kuerzel)?.name ?? kuerzel
}
