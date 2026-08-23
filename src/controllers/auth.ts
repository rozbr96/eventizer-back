
import type { Request, Response } from 'express'

import {
  ActivateUserUseCase,
  CreateUserUseCase,
  CreateUserTokenUseCase,
  LoginUserUseCase,
} from '@/core/use-cases/index.js'

import { UserRepository } from '@/prisma/repositories/index.js'
import { UserTokenRepository } from '@/redis/repositories/index.js'

const activate = (req: Request, resp: Response) => {
  const userRepository = new UserRepository()
  const userTokenRepository = new UserTokenRepository()

  new ActivateUserUseCase(userRepository, userTokenRepository)
    .execute(req.body)
    .then(() => { resp.end() })
    .catch((err) => { resp.status(400).json(err) })
}

const login = (req: Request, resp: Response) => {
  const userRepository = new UserRepository()
  const userTokenRepository = new UserTokenRepository()

  new LoginUserUseCase(userRepository, userTokenRepository)
    .execute(req.body)
    .then((token) => {
      resp.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 3600 * 1000,
      }).end()
    }).catch((err) => { resp.status(400).json(err) })
}

const signup = (req: Request, resp: Response) => {
  const userRepository = new UserRepository()
  const userTokenRepository = new UserTokenRepository()

  new CreateUserUseCase(userRepository)
    .execute(req.body)
    .then(() => {
      new CreateUserTokenUseCase(userTokenRepository)
        .execute({ email: req.body.email, name: req.body.name, role: 'client' })
        .then(() => { resp.end() })
    })
    .catch((err) => { resp.status(400).json(err) })
}

export default { activate, login, signup }

