export const metadata = {
  title: 'Datenschutzerklärung – FreeImmo',
}

export default function DatenschutzPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Datenschutzerklärung</h1>

      <div className="prose prose-gray max-w-none space-y-8 text-gray-700 leading-relaxed">
        <p>
          Wir legen grossen Wert auf den Schutz Ihrer Daten und die Wahrung Ihrer Privatsphäre.
          In dieser Datenschutzerklärung informieren wir Sie darüber, wie wir personenbezogene Daten
          erheben, verarbeiten und nutzen, wenn Sie unsere Website besuchen oder unsere Dienstleistungen
          im Bereich Immobilien in Anspruch nehmen.
        </p>

        <Section nr="1" titel="Verantwortliche Stelle">
          <p>Verantwortlich für die Datenverarbeitung auf dieser Website ist:</p>
          <address className="not-italic mt-3 bg-gray-50 rounded-xl p-4 text-sm space-y-1 border border-gray-200">
            <p className="font-medium text-gray-800">FreeImmo</p>
            <p className="text-gray-600">Schlössliweg 5</p>
            <p className="text-gray-600">8500 Frauenfeld</p>
            <p className="text-gray-600">
              <a href="mailto:admin@freeimmo.ch" className="hover:underline" style={{ color: 'var(--primary)' }}>
                admin@freeimmo.ch
              </a>
            </p>
          </address>
        </Section>

        <Section nr="2" titel="Erhebung und Verarbeitung personenbezogener Daten">
          <p>
            Wir verarbeiten personenbezogene Daten, die wir im Rahmen unserer Geschäftsbeziehung
            von Ihnen erhalten. Dazu gehören insbesondere:
          </p>
          <ul className="mt-4 space-y-4">
            <li>
              <strong className="text-gray-900">Kontaktformulare und E-Mail-Anfragen:</strong>{' '}
              Wenn Sie uns per Kontaktformular oder E-Mail kontaktieren (z. B. für eine
              Besichtigungsanfrage oder ein Mietinteresse), werden Ihre Angaben (Name,
              E-Mail-Adresse, Telefonnummer, Nachrichtentext) zur Bearbeitung der Anfrage
              und für mögliche Anschlussfragen gespeichert.
            </li>
            <li>
              <strong className="text-gray-900">Miet- und Kaufinteressenten:</strong>{' '}
              Bei der konkreten Bewerbung für eine Immobilie erheben wir zusätzliche Daten
              wie Geburtsdatum, Zivilstand, Beruf, Einkommensverhältnisse sowie
              Betreibungsregisterauszüge, sofern dies für die Prüfung des Miet- oder
              Kaufverhältnisses erforderlich ist.
            </li>
            <li>
              <strong className="text-gray-900">Server-Logfiles:</strong>{' '}
              Der Provider dieser Website erhebt und speichert automatisch Informationen
              in sogenannten Server-Logfiles, die Ihr Browser automatisch an uns übermittelt
              (z.B. IP-Adresse, Browsertyp, Datum und Uhrzeit der Serveranfrage). Diese
              Daten sind nicht unmittelbar bestimmten Personen zuordenbar und dienen der
              technischen Sicherstellung des Website-Betriebs.
            </li>
          </ul>
        </Section>

        <Section nr="3" titel="Zweck der Datenverarbeitung">
          <p>Ihre Daten werden ausschliesslich für folgende Zwecke verwendet:</p>
          <ul className="mt-4 space-y-2 list-disc list-inside marker:text-gray-400">
            <li>Bereitstellung und Optimierung unseres Online-Angebots.</li>
            <li>Kommunikation mit Ihnen und Bearbeitung Ihrer Anfragen.</li>
            <li>Organisation von Besichtigungsterminen und Prüfung von Bewerbungsunterlagen.</li>
            <li>Vorbereitung und Abwicklung von Miet- oder Kaufverträgen.</li>
            <li>Erfüllung gesetzlicher Aufbewahrungspflichten.</li>
          </ul>
        </Section>

        <Section nr="4" titel="Weitergabe von Daten an Dritte">
          <p>
            Ihre persönlichen Daten werden nicht an Dritte verkauft oder unberechtigt
            weitergegeben. Eine Weitergabe erfolgt nur, wenn:
          </p>
          <ul className="mt-4 space-y-2 list-disc list-inside marker:text-gray-400">
            <li>Sie Ihre ausdrückliche Einwilligung dazu erteilt haben.</li>
            <li>
              dies für die Abwicklung von Vertragsverhältnissen (z. B. Weitergabe an
              Eigentümer, Verwaltungen, Notariate oder Handwerker im Rahmen der
              Objektbewirtschaftung) erforderlich ist.
            </li>
            <li>wir gesetzlich dazu verpflichtet sind.</li>
            <li>
              es zur Wahrung unserer berechtigten Interessen erforderlich ist
              (z.B. IT-Dienstleister, Hosting-Partner).
            </li>
          </ul>
        </Section>

        <Section nr="5" titel="Cookies">
          <p>
            Diese Website verwendet Cookies. Das sind kleine Textdateien, die auf Ihrem
            Endgerät abgelegt werden. Einige der von uns verwendeten Cookies werden nach
            Ende der Browser-Sitzung wieder gelöscht (Sitzungs-Cookies). Andere Cookies
            verbleiben auf Ihrem Endgerät und ermöglichen es uns, Ihren Browser beim
            nächsten Besuch wiederzuerkennen (persistente Cookies). Sie können Ihren
            Browser so einstellen, dass Sie über das Setzen von Cookies informiert werden
            und Cookies nur im Einzelfall erlauben oder generell ausschliessen. Bei der
            Deaktivierung von Cookies kann die Funktionalität dieser Website eingeschränkt
            sein.
          </p>
        </Section>

        <Section nr="6" titel="Datensicherheit">
          <p>
            Wir setzen technische und organisatorische Sicherheitsmassnahmen ein, um Ihre
            durch uns verwalteten Daten gegen Manipulation, Verlust, Zerstörung oder gegen
            den Zugriff unberechtigter Personen zu schützen. Unsere Website nutzt aus
            Gründen der Sicherheit und zum Schutz der Übertragung vertraulicher Inhalte
            eine SSL- bzw. TLS-Verschlüsselung.
          </p>
        </Section>

        <Section nr="7" titel="Ihre Rechte">
          <p>Sie haben jederzeit das Recht:</p>
          <ul className="mt-4 space-y-2 list-disc list-inside marker:text-gray-400">
            <li>
              Auskunft über Ihre von uns verarbeiteten personenbezogenen Daten zu verlangen.
            </li>
            <li>
              die Berichtigung unrichtiger oder Vervollständigung Ihrer bei uns gespeicherten
              Daten zu verlangen.
            </li>
            <li>
              die Löschung Ihrer gespeicherten Daten zu verlangen, sofern nicht gesetzliche
              Aufbewahrungspflichten oder berechtigte Interessen (wie laufende
              Mietverhältnisse) dem entgegenstehen.
            </li>
            <li>
              der Datenverarbeitung zu widersprechen oder eine erteilte Einwilligung
              jederzeit zu widerrufen.
            </li>
          </ul>
          <p className="mt-4">
            Für die Geltendmachung Ihrer Rechte wenden Sie sich bitte an die unter
            Punkt 1 angegebene Kontaktadresse.
          </p>
        </Section>

        <Section nr="8" titel="Änderungen dieser Datenschutzerklärung">
          <p>
            Wir behalten uns vor, diese Datenschutzerklärung gelegentlich anzupassen,
            damit sie stets den aktuellen rechtlichen Anforderungen entspricht oder um
            Änderungen unserer Leistungen in der Datenschutzerklärung umzusetzen. Für
            Ihren erneuten Besuch gilt dann die neue Datenschutzerklärung.
          </p>
        </Section>
      </div>
    </div>
  )
}

function Section({ nr, titel, children }: { nr: string; titel: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-baseline gap-2">
        <span className="text-sm font-bold tabular-nums" style={{ color: 'var(--primary)' }}>{nr}.</span>
        {titel}
      </h2>
      <div className="text-gray-600 leading-relaxed">{children}</div>
    </section>
  )
}
