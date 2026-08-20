
import type { PrismaClient } from '@prisma/client/extension';

type Tables = Array<{ tablename: string }>

export const truncate = async (prisma: PrismaClient) => {
  const tablenames: Tables = await prisma.$queryRaw<Tables>`SELECT tablename FROM pg_tables WHERE schemaname='public';`

  const tables = tablenames
    .map(({ tablename }) => tablename)
    .filter((name) => name != '_prisma_migrations')
    .map((name) => `"public".${name}`)
    .join(', ')

  await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`)
}

