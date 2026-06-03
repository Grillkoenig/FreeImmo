import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const demo = await prisma.user.upsert({
    where: { email: 'demo@freeimmo.ch' },
    update: {},
    create: { email: 'demo@freeimmo.ch', name: 'FreeImmo Demo' },
  })

  const inserate = [
    {
      titel: 'Helle 3.5-Zimmer-Wohnung an zentraler Lage',
      beschreibung: 'Wunderschöne, helle Wohnung im Herzen von Zürich. Die frisch renovierte Wohnung überzeugt mit moderner Küche, grossem Wohnzimmer und einem gemütlichen Balkon mit Aussicht. Öffentliche Verkehrsmittel direkt vor der Haustür.\n\nAusstattung:\n- Einbauküche mit Geschirrspüler\n- Parkettboden\n- Badezimmer mit Badewanne und Dusche\n- Kellerabteil inklusive\n- Waschküche im Haus',
      preis: 2450,
      zimmer: 3.5,
      flaeche: 82,
      strasse: 'Langstrasse 48',
      plz: '8004',
      ort: 'Zürich',
      typ: 'wohnung',
      modus: 'mieten',
      bilder: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80'],
    },
    {
      titel: 'Modernes Studio – ideal für Singles und Pendler',
      beschreibung: 'Kompaktes, modern eingerichtetes Studio in ruhiger Quartierslage. Perfekt für Berufseinsteiger oder als Zweitwohnung. Vollständig renoviert, mit hochwertigen Materialien ausgestattet.\n\nDetails:\n- Offene Küche mit Induktionskochfeld\n- Duschbad\n- Einbauschrank\n- Nähe Bahnhof (5 Minuten zu Fuss)',
      preis: 1190,
      zimmer: 1,
      flaeche: 32,
      strasse: 'Bundesgasse 12',
      plz: '3011',
      ort: 'Bern',
      typ: 'studio',
      modus: 'mieten',
      bilder: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80'],
    },
    {
      titel: 'Grosszügiges Einfamilienhaus mit Garten',
      beschreibung: 'Traumhaftes Einfamilienhaus in ruhiger Wohngegend mit gepflegtem Garten und Doppelgarage. Das Haus wurde 2019 vollständig renoviert und bietet auf drei Etagen viel Platz für die ganze Familie.\n\nHighlights:\n- 5 Schlafzimmer\n- 2 Badezimmer (1× mit Badewanne)\n- Offene Wohnküche\n- Garten ca. 400 m²\n- Doppelgarage + 2 Aussenparkplätze\n- Keller mit Hobbyraum',
      preis: 1250000,
      zimmer: 6.5,
      flaeche: 210,
      strasse: 'Rosenweg 7',
      plz: '4132',
      ort: 'Muttenz',
      typ: 'haus',
      modus: 'kaufen',
      bilder: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80'],
    },
    {
      titel: '4.5-Zimmer-Wohnung mit Seesicht',
      beschreibung: 'Exklusive Attikawohnung mit atemberaubender Seesicht auf den Vierwaldstättersee. Grosszügige Raumaufteilung, hochwertige Ausstattung und eine Dachterrasse von 45 m² machen diese Wohnung zu einem einzigartigen Angebot.\n\nAusstattung:\n- Dachterrasse 45 m² mit Seeblick\n- Designer-Küche\n- Eichenparkettboden\n- Tiefgaragenplatz inklusive\n- Concierge-Service',
      preis: 3800,
      zimmer: 4.5,
      flaeche: 140,
      strasse: 'Seepromenade 22',
      plz: '6006',
      ort: 'Luzern',
      typ: 'wohnung',
      modus: 'mieten',
      bilder: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80'],
    },
    {
      titel: 'Renoviertes Reiheneinfamilienhaus',
      beschreibung: 'Charmantes Reiheneinfamilienhaus im Grünen, vollständig renoviert und bezugsbereit. Ruhige Lage mit direktem Zugang zu Wanderwegen. Sehr gute Schulen in der Nähe.\n\nDetails:\n- 4 Zimmer über 2 Etagen\n- Neues Bad (2023)\n- Neue Küche (2023)\n- Südausgerichteter Garten 120 m²\n- Carport für 1 Fahrzeug',
      preis: 890000,
      zimmer: 4.5,
      flaeche: 118,
      strasse: 'Im Gässli 3',
      plz: '8620',
      ort: 'Wetzikon',
      typ: 'haus',
      modus: 'kaufen',
      bilder: ['https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&q=80'],
    },
    {
      titel: '2-Zimmer-Wohnung – ruhig und sonnig',
      beschreibung: 'Helle 2-Zimmer-Wohnung in gepflegtem Mehrfamilienhaus. Südlage sorgt für viel Tageslicht. Ideal für ein Paar oder als Singlewohnung. Gute Anbindung ans ÖV-Netz.\n\nDetails:\n- Grosses Schlafzimmer\n- Wohnzimmer mit Balkon\n- Küche mit Essplatz\n- Abstellraum\n- Keller inklusive',
      preis: 1620,
      zimmer: 2,
      flaeche: 58,
      strasse: 'Schützenmattstrasse 61',
      plz: '4051',
      ort: 'Basel',
      typ: 'wohnung',
      modus: 'mieten',
      bilder: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80'],
    },
    {
      titel: 'Gewerbelokal im Zentrum – ideal für Büro oder Praxis',
      beschreibung: 'Helles Gewerbelokal an frequentierter Lage in der Zürcher Innenstadt. Repräsentative Eingangssituation, barrierefreier Zugang und gute Parkmöglichkeiten in der Nähe.\n\nEigenschaften:\n- Offener Grundriss, flexibel unterteilbar\n- WC-Anlage vorhanden\n- Glasfasernetz im Haus\n- Schaufensterfronten möglich',
      preis: 3200,
      zimmer: 3,
      flaeche: 95,
      strasse: 'Bahnhofstrasse 101',
      plz: '8001',
      ort: 'Zürich',
      typ: 'gewerbe',
      modus: 'mieten',
      bilder: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80'],
    },
    {
      titel: 'Stadtnahe 5-Zimmer-Eigentumswohnung',
      beschreibung: 'Grosszügige Eigentumswohnung in gepflegtem Neubau von 2021. Ruhige Lage mit kurzer Distanz zum Bahnhof. Ideal für Familien mit Schulkindern.\n\nAusstattung:\n- 5 Zimmer inkl. 2 Kinderzimmer\n- Offene Wohnküche mit Kücheninsel\n- 2 Badezimmer\n- Terrasse 18 m²\n- Tiefgaragenplatz inklusive\n- Minergie-Standard',
      preis: 1450000,
      zimmer: 5,
      flaeche: 148,
      strasse: 'Neugutstrasse 15',
      plz: '8304',
      ort: 'Wallisellen',
      typ: 'wohnung',
      modus: 'kaufen',
      bilder: ['https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=800&q=80'],
    },
  ]

  for (const data of inserate) {
    await prisma.inserat.create({ data: { ...data, userId: demo.id } })
  }

  console.log(`✓ ${inserate.length} Inserate erstellt`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
