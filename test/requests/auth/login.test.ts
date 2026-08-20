
import request from 'supertest'
import { describe, expect, it } from 'vitest'

import app from '@/app.js'
import prismaClient from '@/prisma/client.js'

describe('POST /auth/login', () => {
  it('logins', async () => {
    const email = 'user@email.com', password = 'pass'

    await prismaClient.user.create({ data: { email, password, name: 'User', active: true } })

    const { status, body } = await request(app).post('/auth/login').send({ email, password })

    expect(status).toBe(200)
    expect(body.token).not.toBeNull()
  })

  it('fails to login due to non existent user', async () => {
    const email = 'user@email.com', password = 'pass'

    const { status, body } = await request(app).post('/auth/login').send({ email, password })

    expect(status).toBe(400)
    expect(body).toStrictEqual({ detail: 'Invalid Data' })
  })

  it('fails to login due to inactive user', async () => {
    const email = 'user@mail.com', password = 'pass'

    await prismaClient.user.create({ data: { email, password, name: 'User', active: false } })

    const { status, body } = await request(app).post('/auth/login').send({ email, password })

    expect(status).toBe(400)
    expect(body).toStrictEqual({ detail: 'Inactive User' })
  })

  it('fails to login due to invalid data', async () => {
    const email = '', password = ''

    const { status, body } = await request(app).post('/auth/login').send({ email, password })

    expect(status).toBe(400)
    expect(body).toStrictEqual({
      details: [
        '[email] Invalid email address',
        '[password] Cannot be blank'
      ]
    })
  })
})
