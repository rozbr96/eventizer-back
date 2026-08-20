
import request from 'supertest'
import { beforeEach, describe, expect, it } from 'vitest'

import app from '@/app.js'
import prismaClient from '@/prisma/client.js'
import { truncate } from '@test/prisma/helpers.js'


describe('POST /auth/signup', () => {
  beforeEach(async () => { await truncate(prismaClient) })

  it('creates an user', async () => {
    const { status } = await request(app).post('/auth/signup').send({
      name: 'John Doe',
      password: 'password',
      email: 'john.doe@email.com'
    })

    const user = await prismaClient.user.findUnique({ where: { email: 'john.doe@email.com' } })

    expect(status).toBe(200)
    expect(user).toMatchObject({
      name: 'John Doe',
      password: 'password',
      email: 'john.doe@email.com',
      active: false,
      role: 'client'
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
})
