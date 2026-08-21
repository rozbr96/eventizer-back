
import prismaClient from '@/prisma/client.js'

import type { SearchResult } from '@/core/entities/index.js'
import type { SearchResultRepository } from '@/core/repositories/index.js'

export default class implements SearchResultRepository {
  get(key: string): Promise<SearchResult> {
    return new Promise((resolve, reject) => {
      prismaClient
        .searchResult
        .findFirst({
          where: {
            key,
            expires_at: { gte: new Date() }
          }
        }).then((searchResult) => {
          resolve(searchResult as SearchResult)
        }).catch(reject)
    })
  }

  set(key: string, value: any, expiresAt: Date): Promise<void> {
    const result = JSON.stringify(value)

    return new Promise((resolve, reject) => {
      prismaClient.searchResult
        .upsert({
          where: { key },
          create: {
            key,
            result
          },
          update: {
            result,
            expires_at: expiresAt,
          }
        }).then(() => { resolve() }).catch(reject)
    })
  }
}
