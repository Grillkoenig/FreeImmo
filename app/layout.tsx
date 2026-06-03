import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import SessionProvider from '@/components/SessionProvider'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'FreeImmo – Immobilien in der Schweiz',
  description: 'Schweizer Immobilienplattform – Wohnungen und Häuser mieten oder kaufen.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-50">
        <SessionProvider>
          <Navigation />
          <main className="flex-1">{children}</main>
        <footer className="bg-white border-t border-gray-200 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center">
                <span className="text-xl font-bold" style={{ color: 'var(--primary)' }}>Free</span>
                <span className="text-xl font-bold text-gray-900">Immo</span>
              </div>
              <p className="text-gray-500 text-sm">© 2026 FreeImmo. Alle Rechte vorbehalten.</p>
              <div className="flex gap-6 text-sm text-gray-500">
                <a href="/datenschutz" className="hover:text-gray-900">Datenschutz</a>
                <a href="#" className="hover:text-gray-900">AGB</a>
                <a href="#" className="hover:text-gray-900">Kontakt</a>
              </div>
            </div>
          </div>
        </footer>
        </SessionProvider>
      </body>
    </html>
  )
}
