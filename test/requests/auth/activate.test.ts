
import request from 'supertest'
import { describe, expect, it } from 'vitest'

import app from '@/app.js'
import prismaClient from '@/prisma/client.js'
import redisClient from '@/redis/client.js'

describe('POST /auth/activate', () => {
  it('activates an user', async () => {
    const email = 'user@mail.com', token = 'activation-token'

    await prismaClient.user.create({ data: { email, password: 'pass', name: 'User', active: false } })
    await redisClient.set(email, token)

    const { status } = await request(app).post('/auth/activate').send({ email, token })
    const user = await prismaClient.user.findUnique({ where: { email } })

    expect(status).toBe(200)
    expect(user?.active).toBe(true)
  })

  it('fails to activate due to invalid token', async () => {
    const email = 'user@email.com', token = 'activation-token'

    await prismaClient.user.create({ data: { email, password: 'pass', name: 'User', active: false } })
    await redisClient.set(email, token)

    const { status } = await request(app).post('/auth/activate').send({ email, token: 'invalid-token' })
    const user = await prismaClient.user.findUnique({ where: { email } })

    expect(status).toBe(400)
    expect(user?.active).toBe(false)
  })

  it('fails to activate due to non existing user', async () => {
    const email = 'user@email.com', token = 'activation-token'

    const { status } = await request(app).post('/auth/activate').send({ email, token })
    const user = await prismaClient.user.findUnique({ where: { email } })

    expect(status).toBe(400)
    expect(user).toBe(null)
  })

  it('fails to activate due to invalid data', async () => {
    const email = 'invalid email', token = ''

    const { status, body } = await request(app).post('/auth/activate').send({ email, token })

    expect(status).toBe(400)
    expect(body).toStrictEqual({
      details: [
        "[email] Invalid email address",
        "[token] Cannot be blank",
      ]
    })
  })
})
