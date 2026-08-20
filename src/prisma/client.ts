
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@/prisma/generated/client.js'

const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS } = process.env

const adapter = new PrismaPg({
  connectionString: `postgresql://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`
})

export default new PrismaClient({ adapter })

