
import UserRepository from '@/prisma/repositories/user.js'
import UserTokenRepository from '@/redis/repositories/user-token.js'

import {
  CreateUserUseCase,
  CreateUserTokenUseCase
} from '@/core/use-cases/index.js'

import type {
  Role,
  UserCreation,
  UserRetrieval,
  UserTokenData
} from '@/core/entities/index.js'

export const authenticate = async (user: UserTokenData) => {
  const userTokenRepository = new UserTokenRepository()

  return await new CreateUserTokenUseCase(userTokenRepository).execute(user)
}

export const createUser = async (data: {
  email?: string
  active?: boolean
  name?: string
  password?: string
  role?: Role
} = {}): Promise<UserRetrieval> => {
  const userData: UserCreation = Object.assign({
    email: 'user@mail.com',
    active: true,
    name: 'User',
    password: 'pass',
    role: 'client'
  }, data)

  const userRepository = new UserRepository()

  return await new CreateUserUseCase(userRepository).execute(userData)
}

