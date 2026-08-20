
import redisClient from '@/redis/client.js'
import { UserTokenRepository } from '@/core/repositories/index.js'
import type { SetOptions } from 'redis'

export default class extends UserTokenRepository {
  get(email: string): Promise<string | null> {
    return redisClient.get(email)
  }

  set(email: string, token: string, expiresIn?: number): Promise<void> {
    const options: SetOptions = {}

    if (expiresIn) options.expiration = { type: 'EX', value: expiresIn }

    return new Promise((resolve, reject) => {
      redisClient.set(email, token, options).then(() => { resolve() }).catch(reject)
    })
  }
}

