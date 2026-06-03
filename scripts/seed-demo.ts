import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const PHOTOS = {
  wohnzimmer: [
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
    'https://images.unsplash.com/photo-1567767292278-a2f83fb12e9e?w=800&q=80',
    'https://images.unsplash.com/photo-1574691250077-03a929faece5?w=800&q=80',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
  ],
  kueche: [
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80',
    'https://images.unsplash.com/photo-1565183928294-7063f23ce0f8?w=800&q=80',
    'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800&q=80',
    'https://images.unsplash.com/photo-1556909114-3f47f1c7c60c?w=800&q=80',
  ],
  schlafzimmer: [
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
    'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800&q=80',
    'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&q=80',
  ],
  bad: [
    'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&q=80',
    'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80',
  ],
  aussen_wohnung: [
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80',
    'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=800&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
  ],
  haus_aussen: [
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80',
    'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  ],
  buero: [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80',
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80',
  ],
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function bildSet(typ: string): string[] {
  if (typ === 'gewerbe') {
    return [PHOTOS.buero[0], PHOTOS.buero[1], PHOTOS.buero[2]]
  }
  if (typ === 'haus') {
    return [
      pick(PHOTOS.haus_aussen),
      pick(PHOTOS.wohnzimmer),
      pick(PHOTOS.kueche),
      pick(PHOTOS.schlafzimmer),
      pick(PHOTOS.bad),
    ]
  }
  if (typ === 'studio') {
    return [
      pick(PHOTOS.wohnzimmer),
      pick(PHOTOS.kueche),
      pick(PHOTOS.bad),
    ]
  }
  return [
    pick(PHOTOS.aussen_wohnung),
    pick(PHOTOS.wohnzimmer),
    pick(PHOTOS.kueche),
    pick(PHOTOS.schlafzimmer),
    pick(PHOTOS.bad),
  ]
}

async function main() {
  const demo = await prisma.user.upsert({
    where: { email: 'demo@freeimmo.ch' },
    update: {},
    create: { email: 'demo@freeimmo.ch', name: 'FreeImmo Demo' },
  })

  const inserate = [
    {
      titel: 'Traumhafte 4.5-Zimmer-Wohnung mit Balkon',
      beschreibung: 'Grosszügige, lichtdurchflutete Wohnung in ruhiger Lage mit tollem Balkon und Bergblick. Frisch renoviert mit hochwertiger Ausstattung.\n\nHighlights:\n- Grosser Südbalkon\n- Offene Küche mit Insel\n- Parkettböden\n- Tiefgaragenplatz inklusive\n- Nähe zu Seen und Bergen',
      preis: 2800, zimmer: 4.5, flaeche: 105, strasse: 'Bergstrasse 18', plz: '6003', ort: 'Luzern', typ: 'wohnung', modus: 'mieten',
    },
    {
      titel: 'Elegantes Stadthaus in bester Lage',
      beschreibung: 'Exklusives Stadthaus mit drei Etagen, grossem Garten und Dachterrasse. Erstklassige Lage im begehrten Quartier.\n\n- 5 Zimmer auf 3 Etagen\n- Garten 200 m²\n- Dachterrasse\n- Doppelgarage\n- Smart-Home System\n- Minergie-A zertifiziert',
      preis: 2850000, zimmer: 5.5, flaeche: 240, strasse: 'Rennwegstrasse 4', plz: '8001', ort: 'Zürich', typ: 'haus', modus: 'kaufen',
    },
    {
      titel: 'Modernes Studio an der Aare',
      beschreibung: 'Stilvolles Studio direkt an der Aare mit traumhafter Aussicht. Ideal für Berufspendler oder Studenten.\n\n- Vollausgestattete Küche\n- Designer-Bad\n- Einbauschrank\n- Fahrradkeller\n- Waschküche im Haus\n- 5 Min. zum Bahnhof',
      preis: 1350, zimmer: 1, flaeche: 38, strasse: 'Aarbergergasse 22', plz: '3011', ort: 'Bern', typ: 'studio', modus: 'mieten',
    },
    {
      titel: 'Charmantes Chalet in den Alpen',
      beschreibung: 'Traumhaftes Holzchalet in sonniger Alpenlage mit atemberaubendem Panoramablick. Rustikal und modern zugleich.\n\n- 4 Schlafzimmer\n- Offener Kamin\n- Sauna\n- Grosse Terrasse\n- Carport\n- Skipiste 200m entfernt',
      preis: 1650000, zimmer: 6, flaeche: 195, strasse: 'Alpweg 3', plz: '3818', ort: 'Grindelwald', typ: 'haus', modus: 'kaufen',
    },
    {
      titel: 'Helles 2.5-Zimmer-Apartment im Neubau',
      beschreibung: 'Topmodernes Apartment in neuem Wohnüberbauung, bezugsbereit. Hochwertige Ausstattung, perfekter Grundriss.\n\n- Bodenheizung\n- Dreifachverglasung\n- Lift\n- Aussenparkplatz\n- Nähe Migros und Schule',
      preis: 1780, zimmer: 2.5, flaeche: 67, strasse: 'Neubadstrasse 9', plz: '4054', ort: 'Basel', typ: 'wohnung', modus: 'mieten',
    },
    {
      titel: 'Repräsentative Bürofläche im Zentrum',
      beschreibung: 'Hochwertige Bürofläche in zentralster Lage, ideal für Praxis, Kanzlei oder Agentur. Sofort verfügbar.\n\n- Offener Grundriss, 3 Einzelbüros möglich\n- Empfangsbereich\n- 2 WC-Anlagen\n- Klimaanlage\n- Glasfaser\n- Parkhaus nebenan',
      preis: 4500, zimmer: 4, flaeche: 120, strasse: 'Bahnhofplatz 1', plz: '9001', ort: 'St. Gallen', typ: 'gewerbe', modus: 'mieten',
    },
    {
      titel: 'Grosszügige 5.5-Zimmer-Familienwohnung',
      beschreibung: 'Viel Platz für die Familie in ruhiger, kinderfreundlicher Quartierslage. Eigener Garten und Doppelgarage inklusive.\n\n- 5 Zimmer + Hobbyraum\n- Garten 180 m²\n- Doppelgarage\n- 2 Badezimmer\n- Keller\n- Gute Schulen in 5 Minuten',
      preis: 3200, zimmer: 5.5, flaeche: 155, strasse: 'Kirchfeldstrasse 47', plz: '3005', ort: 'Bern', typ: 'wohnung', modus: 'mieten',
    },
    {
      titel: 'Penthouse mit 360°-Aussicht',
      beschreibung: 'Einzigartiges Penthouse auf dem Dach eines modernen Hochhauses. Rundum-Terrasse, keine Nachbarn über dir.\n\n- 280m² Wohnfläche\n- 120m² Dachterrasse\n- Panoramaverglasung\n- 2 Tiefgaragenplätze\n- Private Sauna\n- Concierge',
      preis: 4200000, zimmer: 5, flaeche: 280, strasse: 'Europaallee 21', plz: '8004', ort: 'Zürich', typ: 'wohnung', modus: 'kaufen',
    },
    {
      titel: 'Renoviertes Stadthaus in der Altstadt',
      beschreibung: 'Historisches Stadthaus mit modernem Innenausbau in der malerischen Altstadt von Schaffhausen. Einmalige Gelegenheit.\n\n- Original Balkendecken\n- Moderne Küche\n- 2 Badezimmer\n- Kleiner Innenhof\n- Fussgängerzone',
      preis: 980000, zimmer: 4, flaeche: 130, strasse: 'Vordergasse 14', plz: '8200', ort: 'Schaffhausen', typ: 'haus', modus: 'kaufen',
    },
    {
      titel: 'Sonnige 3.5-Zimmer-Terrassenwohnung',
      beschreibung: 'Schöne Terrassenwohnung in ruhiger Hanglage mit Seesicht. Südausrichtung, viel Licht, sehr gepflegt.\n\n- Terrasse 35 m² mit Seesicht\n- Offene Küche\n- Parkett\n- Tiefgarage inklusive\n- Lift im Haus',
      preis: 2100, zimmer: 3.5, flaeche: 88, strasse: 'Seehaldenweg 6', plz: '8706', ort: 'Feldmeilen', typ: 'wohnung', modus: 'mieten',
    },
    {
      titel: 'Modernes Einfamilienhaus mit Pool',
      beschreibung: 'Luxuriöses Einfamilienhaus mit Swimmingpool, Fitnessraum und weitläufigem Garten. Architektenhaus aus 2020.\n\n- Swimmingpool\n- Fitnessraum\n- Garten 800 m²\n- Doppelgarage\n- 4 Schlafzimmer\n- Gäste-WC\n- Smart Home',
      preis: 3800000, zimmer: 7, flaeche: 320, strasse: 'Goldhaldenstrasse 55', plz: '8702', ort: 'Zollikon', typ: 'haus', modus: 'kaufen',
    },
    {
      titel: 'Zentrale 1.5-Zimmer-Wohnung – sofort frei',
      beschreibung: 'Praktische, gut geschnittene Wohnung direkt beim Bahnhof. Ideal als Zweitwohnung oder Pied-à-terre.\n\n- Einbauküche\n- Duschbad\n- Kellerabteil\n- ÖV-Anbindung optimal\n- Einkauf direkt nebenan',
      preis: 1480, zimmer: 1.5, flaeche: 45, strasse: 'Bahnhofstrasse 33', plz: '8400', ort: 'Winterthur', typ: 'wohnung', modus: 'mieten',
    },
    {
      titel: 'Landhaus mit Reitanlage',
      beschreibung: 'Einzigartiges Anwesen mit Wohnhaus, Reitstall, Paddock und 2 Hektaren Wiesen. Absolute Rarität.\n\n- Wohnhaus 250 m²\n- Reitstall 8 Boxen\n- Paddock und Reithalle\n- 2 ha Wiesland\n- Nebengebäude',
      preis: 2900000, zimmer: 6, flaeche: 250, strasse: 'Landweg 12', plz: '8165', ort: 'Schleinikon', typ: 'haus', modus: 'kaufen',
    },
    {
      titel: 'Atelierwohnung im Industrie-Loft-Stil',
      beschreibung: 'Einzigartiges Loft in umgebautem Industriegebäude. Hohe Decken, grosse Fenster, offener Grundriss.\n\n- Deckenhöhe 4.5 m\n- Riesige Fensterfronten\n- Galerie mit Schlafzimmer\n- Offene Küche\n- Designerbad\n- Veloraum',
      preis: 2650, zimmer: 2.5, flaeche: 95, strasse: 'Fabrikgasse 8', plz: '4057', ort: 'Basel', typ: 'wohnung', modus: 'mieten',
    },
    {
      titel: 'Neubauwohnung mit Weitsicht – Erstbezug',
      beschreibung: 'Brandneue 3.5-Zimmer-Wohnung, noch nie bewohnt. Hochwertige Ausstattung, toller Ausblick ins Grüne.\n\n- Erstbezug\n- Bodenheizung\n- Minergie-P\n- Tiefgaragenplatz\n- Lift\n- E-Bike-Ladestation',
      preis: 680000, zimmer: 3.5, flaeche: 92, strasse: 'Aussichtsweg 1', plz: '8610', ort: 'Uster', typ: 'wohnung', modus: 'kaufen',
    },
    {
      titel: 'Stilvoll möbliertes Studio – Kurzzeitmiete',
      beschreibung: 'Vollmöbliertes, stilvolles Studio ideal für Expats oder auf Montage tätige Personen. Flexibel buchbar.\n\n- Komplett eingerichtet\n- Smart-TV\n- Schnelles WLAN\n- Reinigungsservice möglich\n- Zentrale Lage\n- Mindestmietdauer 1 Monat',
      preis: 1900, zimmer: 1, flaeche: 35, strasse: 'Löwenstrasse 16', plz: '8001', ort: 'Zürich', typ: 'studio', modus: 'mieten',
    },
    {
      titel: 'Doppeleinfamilienhaus – Haushälfte',
      beschreibung: 'Gepflegte Haushälfte in familienfreundlicher Gemeinde. Sonniger Garten, ruhige Strasse, gute Schulen.\n\n- 4.5 Zimmer\n- Garten 220 m²\n- Garage\n- Keller\n- 2 Nasszellen\n- Waschküche',
      preis: 1150000, zimmer: 4.5, flaeche: 128, strasse: 'Lindenweg 9', plz: '5430', ort: 'Wettingen', typ: 'haus', modus: 'kaufen',
    },
    {
      titel: 'Grosses Gewerbelokal mit Lager',
      beschreibung: 'Vielseitig nutzbares Gewerbelokal mit separatem Lagerraum und ebenerdiger Zufahrt. Ideal für Handwerk oder Detailhandel.\n\n- 180 m² Verkaufs-/Bürofläche\n- 60 m² Lager\n- Rolltor\n- 3 Parkplätze\n- Gute Sichtbarkeit',
      preis: 3800, zimmer: 5, flaeche: 240, strasse: 'Industriestrasse 44', plz: '8953', ort: 'Dietikon', typ: 'gewerbe', modus: 'mieten',
    },
    {
      titel: 'Romantische 3-Zimmer-Altstadtwohnung',
      beschreibung: 'Charaktervolle Wohnung in historischem Haus mitten in der Altstadt. Frisch renoviert, Altbaucharme pur.\n\n- Originale Parkettböden\n- Kachelofennische\n- Neue Küche\n- Renoviertes Bad\n- Fussgängerzone\n- Historischer Charme',
      preis: 1950, zimmer: 3, flaeche: 78, strasse: 'Münstergasse 7', plz: '3011', ort: 'Bern', typ: 'wohnung', modus: 'mieten',
    },
    {
      titel: 'Exklusives Chalet direkt am See',
      beschreibung: 'Seltene Gelegenheit: Luxuriöses Chalet direkt am Vierwaldstättersee mit privatem Bootsanleger.\n\n- Direkter Seezugang\n- Privater Bootsanleger\n- Garten 600 m²\n- 5 Schlafzimmer\n- 3 Badezimmer\n- Doppelgarage\n- Sauna & Whirlpool',
      preis: 5500000, zimmer: 6.5, flaeche: 295, strasse: 'Seeuferpfad 2', plz: '6354', ort: 'Vitznau', typ: 'haus', modus: 'kaufen',
    },
  ]

  let count = 0
  for (const data of inserate) {
    await prisma.inserat.create({
      data: {
        ...data,
        bilder: bildSet(data.typ),
        userId: demo.id,
      },
    })
    count++
  }

  console.log(`✓ ${count} Inserate mit Fotos erstellt`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
