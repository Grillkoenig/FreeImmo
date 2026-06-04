import { prisma } from '@/lib/prisma'
import { adminToggleRegistration } from '@/app/admin/actions'

export default async function EinstellungenPage() {
  const settings = await prisma.settings.findUnique({ where: { id: 'default' } })
  const registrationEnabled = settings?.registrationEnabled ?? true

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Einstellungen</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-lg">
        <h2 className="text-base font-semibold text-gray-900 mb-1">Registrierung</h2>
        <p className="text-sm text-gray-500 mb-4">
          Steuert, ob neue Benutzer ein Konto erstellen können.
        </p>

        <form action={adminToggleRegistration}>
          <div className="flex items-center justify-between">
            <span className={`text-sm font-medium ${registrationEnabled ? 'text-green-700' : 'text-red-600'}`}>
              {registrationEnabled ? 'Registrierung geöffnet' : 'Registrierung gesperrt'}
            </span>
            <button
              type="submit"
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                registrationEnabled
                  ? 'bg-green-500 focus:ring-green-500'
                  : 'bg-gray-300 focus:ring-gray-400'
              }`}
              aria-checked={registrationEnabled}
              role="switch"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                  registrationEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
