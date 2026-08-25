
import request from 'supertest'
import { afterEach, describe, expect, it, vi } from 'vitest'

import app from '@/app.js'
import prismaClient from '@/prisma/client.js'
import redisClient from '@/redis/client.js'

describe('POST /auth/signup', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
  })

  it('creates an inactive user and sends an activation email', async () => {
    const mailSpy = vi.spyOn(console, 'info').mockImplementation(() => {})
    vi.stubEnv('USER_ACTIVATION_URL', 'https://app.eventizer.test/activate')

    const { status } = await request(app).post('/auth/signup').send({
      name: 'John Doe',
      password: 'password',
      email: 'john.doe@email.com'
    })

    const user = await prismaClient.user.findUnique({ where: { email: 'john.doe@email.com' } })
    const token = await redisClient.get('activation:john.doe@email.com')
    const tokenTtl = await redisClient.ttl('activation:john.doe@email.com')

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
    expect(mailSpy).toHaveBeenCalledWith({
      mail: expect.objectContaining({
        to: 'john.doe@email.com',
        subject: 'Activate your Eventizer account',
        text: expect.stringContaining(`https://app.eventizer.test/activate?email=john.doe%40email.com&token=${token}`)
      })
    })
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
