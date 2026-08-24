
import request from 'supertest'
import { describe, expect, it } from 'vitest'

import app from '@/app.js'
import redisClient from '@/redis/client.js'
import { authenticate, createUser } from '@test/helpers.js'

const doRequest = async (token: string = '') =>
  request(app).post('/auth/logout').set('Cookie', `token=${token}`).send()

describe('POST /auth/logout', () => {
  it('logs out', async () => {
    const user = await createUser()
    const token = await authenticate(user)

    const { status, headers } = await doRequest(token)
    const storedToken = await redisClient.get(user.email)
    const cookie = Array.isArray(headers['set-cookie'])
      ? headers['set-cookie'].join(';')
      : headers['set-cookie'] || ''

    expect(status).toBe(200)
    expect(storedToken).toBeNull()
    expect(cookie).toContain('token=')
    expect(cookie).toContain('Expires=Thu, 01 Jan 1970')
  })

  it('fails without authentication', async () => {
    const { status, body } = await request(app).post('/auth/logout').send()

    expect(status).toBe(401)
    expect(body).toStrictEqual({ detail: 'Unauthenticated' })
  })
})
