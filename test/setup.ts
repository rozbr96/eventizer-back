
import { beforeEach } from 'vitest'
import prismaClient from '@/prisma/client.js'
import { truncate } from './prisma/helpers.js'

beforeEach(async () => { await truncate(prismaClient) })

