
import prismaClient from '@/prisma/client.js'

import type { UserCreation, UserEdition, UserRetrieval } from '@/core/entities/index.js'
import { UserRepository } from '@/core/repositories/index.js'

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

  update(email: string, data: UserEdition): Promise<UserRetrieval> {
    return new Promise((resolve, reject) => {
      prismaClient
        .user
        .update({ where: { email }, data })
        .then(resolve)
        .catch(reject)
    })
  }
}
