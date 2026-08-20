
import { describe, expect, it } from 'vitest'

import prismaClient from '@/prisma/client.js'
import UserRepository from '@/prisma/repositories/user.js'

describe('UserRepository', () => {
  it('creates an user', async () => {
    const userRepository = new UserRepository()

    const user = await userRepository.create({ email: 'user@email.com', active: true, name: 'User', role: 'client', password: 'pass' })

    expect(user.id).not.toBeNull
  })

  it('finds user by email', async () => {
    await prismaClient.user.create({ data: { email: 'user@email.com', active: true, name: 'User', role: 'client', password: 'pass' } })

    const userRepository = new UserRepository()

    const user = await userRepository.findByEmail('user@email.com')

    expect(user).toMatchObject({
      name: 'User',
      email: 'user@email.com',
      active: true,
      role: 'client',
      password: 'pass'
    })
  })
})
