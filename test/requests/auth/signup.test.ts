
import request from 'supertest'
import { describe, expect, it } from 'vitest'

import app from '@/app.js'
import prismaClient from '@/prisma/client.js'
import redisClient from '@/redis/client.js'

describe('POST /auth/signup', () => {
  it('creates an user and its first token', async () => {
    const { status } = await request(app).post('/auth/signup').send({
      name: 'John Doe',
      password: 'password',
      email: 'john.doe@email.com'
    })

    const user = await prismaClient.user.findUnique({ where: { email: 'john.doe@email.com' } })
    const token = await redisClient.get('john.doe@email.com')
    const tokenTtl = await redisClient.ttl('john.doe@email.com')

    expect(status).toBe(200)
    expect(user).toMatchObject({
      name: 'John Doe',
      password: 'password',
      email: 'john.doe@email.com',
      active: false,
      role: 'client'
    })

    expect(token).not.toBeNull()
    expect(tokenTtl).toBeGreaterThanOrEqual(3590)
    expect(tokenTtl).toBeLessThanOrEqual(3600)
  })

  it('creates an inactive client user regardless of incoming role and active data', async () => {
    await request(app).post('/auth/signup').send({
      name: 'John Doe',
      password: 'password',
      email: 'john.doe@email.com',
      active: true,
      role: 'organizer'
    })

    const user = await prismaClient.user.findUnique({ where: { email: 'john.doe@email.com' } })

    expect(user).toMatchObject({ active: false, role: 'client' })
  })

  it('fails to create due to existing email conflict', async () => {
    await prismaClient.user.create({ data: { name: 'John Doe', email: 'john.doe@email.com', password: 'pass' } })

    const { status, body } = await request(app)
      .post('/auth/signup')
      .send({
        name: 'Any Name', password: 'Any Pass',
        email: 'john.doe@email.com'
      })

    expect(status).toBe(400)
    expect(body).toMatchObject({ detail: 'Email is already in use' })
  })

  it('fails to create due to missing data', async () => {
    const { status, body } = await request(app)
      .post('/auth/signup')
      .send({ name: '', password: '', email: '' })

    expect(status).toBe(400)
    expect(body).toStrictEqual({
      details: [
        '[name] Cannot be blank',
        '[email] Invalid email address',
        '[password] Cannot be blank'
      ]
    })
  })
})
