import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = process.argv[2]
  const password = process.argv[3]

  if (!email || !password) {
    console.error('Usage: npx tsx scripts/create-admin.ts <email> <password>')
    process.exit(1)
  }

  if (password.length < 8) {
    console.error('Passwort muss mind. 8 Zeichen haben.')
    process.exit(1)
  }

  const hashed = await bcrypt.hash(password, 12)

  const user = await prisma.user.upsert({
    where: { email },
    update: { password: hashed, role: 'admin' },
    create: { email, password: hashed, role: 'admin', name: 'Admin' },
  })

  console.log(`✓ Admin-Account bereit: ${user.email} (id: ${user.id})`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
