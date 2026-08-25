import redisClient from '@/redis/client.js'
import { UserActivationTokenRepository } from '@/core/repositories/index.js'
import type { SetOptions } from 'redis'

const key = (email: string) => `activation:${email}`

export default class extends UserActivationTokenRepository {
  get(email: string): Promise<string | null> {
    return redisClient.get(key(email))
  }

  delete(email: string): Promise<void> {
    return new Promise((resolve, reject) => {
      redisClient.del(key(email)).then(() => { resolve() }).catch(reject)
    })
  }

  set(email: string, token: string, expiresIn?: number): Promise<void> {
    const options: SetOptions = {}

    if (expiresIn) options.expiration = { type: 'EX', value: expiresIn }

    return new Promise((resolve, reject) => {
      redisClient.set(key(email), token, options).then(() => { resolve() }).catch(reject)
    })
  }
}
