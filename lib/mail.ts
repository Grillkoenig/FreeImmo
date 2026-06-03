import nodemailer from 'nodemailer'

function createTransport() {
  const host = process.env.SMTP_HOST
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port: parseInt(process.env.SMTP_PORT ?? '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user, pass },
    })
  }

  // Dev fallback: log to console
  return nodemailer.createTransport({ streamTransport: true, newline: 'unix' })
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const from = process.env.SMTP_FROM ?? 'FreeImmo <noreply@freeimmo.ch>'
  const transport = createTransport()

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;color:#171717">
      <div style="background:#e8003d;padding:24px 32px;border-radius:12px 12px 0 0">
        <span style="color:#fff;font-size:22px;font-weight:700">FreeImmo</span>
      </div>
      <div style="background:#fff;border:1px solid #e5e7eb;border-top:none;padding:32px;border-radius:0 0 12px 12px">
        <h2 style="margin:0 0 12px;font-size:20px">Passwort zurücksetzen</h2>
        <p style="color:#6b7280;margin:0 0 24px;line-height:1.6">
          Du hast eine Anfrage zum Zurücksetzen deines Passworts gestellt.
          Klicke auf den Button, um ein neues Passwort festzulegen.
          Der Link ist <strong>1 Stunde</strong> gültig.
        </p>
        <a href="${resetUrl}"
           style="display:inline-block;background:#e8003d;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px">
          Passwort zurücksetzen
        </a>
        <p style="color:#9ca3af;font-size:12px;margin-top:24px;line-height:1.6">
          Wenn du keine Anfrage gestellt hast, kannst du diese E-Mail ignorieren.<br>
          Der Link läuft automatisch ab.
        </p>
        <hr style="border:none;border-top:1px solid #f3f4f6;margin:24px 0">
        <p style="color:#d1d5db;font-size:11px;margin:0">
          Falls der Button nicht funktioniert, kopiere diesen Link:<br>
          <a href="${resetUrl}" style="color:#e8003d;word-break:break-all">${resetUrl}</a>
        </p>
      </div>
    </div>
  `

  const info = await transport.sendMail({
    from,
    to,
    subject: 'Passwort zurücksetzen – FreeImmo',
    html,
    text: `Passwort zurücksetzen:\n\n${resetUrl}\n\nDer Link ist 1 Stunde gültig.`,
  })

  // Dev fallback: print reset URL to console so it's visible in PM2 logs
  if (!process.env.SMTP_HOST) {
    console.log('\n──────────────────────────────────────────')
    console.log('📧  PASSWORD RESET (kein SMTP konfiguriert)')
    console.log('   An:', to)
    console.log('   Link:', resetUrl)
    console.log('──────────────────────────────────────────\n')
  }

  return info
}
