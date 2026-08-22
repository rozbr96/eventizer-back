
import { describe, expect, it } from 'vitest'

import redisClient from '@/redis/client.js'
import { UserTokenRepository } from '@/redis/repositories/index.js'

describe('UserTokenRepository', () => {
  it('stores user token', async () => {
    const userTokenRepository = new UserTokenRepository()

    await userTokenRepository.set('user@email.com', 'token')

    const retrievedToken = await redisClient.get('user@email.com')

    expect(retrievedToken).toBe('token')
  })

  it('stores user token with expire time', async () => {
    const userTokenRepository = new UserTokenRepository()

    await userTokenRepository.set('user@email.com', 'token', 3600)

    const ttl = await redisClient.ttl('user@email.com')

    expect(ttl).toBeGreaterThanOrEqual(0)
    expect(ttl).toBeLessThanOrEqual(3600)
  })

  it('retrieves user token', async () => {
    redisClient.set('user@email.com', 'token')

    const userTokenRepository = new UserTokenRepository()

    const retrievedToken = await userTokenRepository.get('user@email.com')

    expect(retrievedToken).toBe('token')
  })
})

