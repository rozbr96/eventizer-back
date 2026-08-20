
import prismaClient from '@/prisma/client.js'

import type { UserCreation, UserRetrieval } from '@/core/entities/index.js'
import { UserRepository } from '@/core/repositories/user.js'

export default class extends UserRepository {
  create(user: UserCreation): Promise<UserRetrieval> {
    return new Promise((resolve, reject) => {
      prismaClient
        .user
        .create({ data: user })
        .then(resolve)
        .catch(reject)
    })
  }

  findByEmail(email: string): Promise<UserRetrieval | null> {
    return new Promise((resolve, reject) => {
      prismaClient
        .user
        .findUnique({ where: { email } })
        .then(resolve)
        .catch(reject)
    })
  }
}
