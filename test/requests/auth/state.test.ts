
import request from 'supertest'
import { describe, expect, it } from 'vitest'

import app from '@/app.js'
import { authenticate, createUser } from '@test/helpers.js'

const doRequest = async (token: string = '') =>
  request(app).get('/auth/state').set('Cookie', `token=${token}`).send()

describe('GET /auth/state', () => {
  it('returns authentication state', async () => {
    const user = await createUser()
    const token = await authenticate(user)

    const { status, body } = await doRequest(token)

    expect(status).toBe(200)
    expect(body).toMatchObject({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    })
  })

  it('fails without authentication', async () => {
    const { status, body } = await request(app).get('/auth/state').send()

    expect(status).toBe(401)
    expect(body).toStrictEqual({ detail: 'Unauthenticated' })
  })
})
