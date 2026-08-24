
import type { NextFunction, Request, Response } from 'express'

import {
  ActivateUserUseCase,
  CreateUserUseCase,
  CreateUserTokenUseCase,
  LoginUserUseCase,
} from '@/core/use-cases/index.js'

import { UserRepository } from '@/prisma/repositories/index.js'
import { UserTokenRepository } from '@/redis/repositories/index.js'

const activate = (req: Request, resp: Response, next: NextFunction) => {
  const userRepository = new UserRepository()
  const userTokenRepository = new UserTokenRepository()

  new ActivateUserUseCase(userRepository, userTokenRepository)
    .execute(req.body)
    .then(() => { resp.end() })
    .catch((err) => { next(err || {}) })
}

const state = (req: Request, resp: Response) => {
  resp.json(req.app.locals.user)
}

const login = (req: Request, resp: Response, next: NextFunction) => {
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
    }).catch((err) => { next(err || {}) })
}

const signup = (req: Request, resp: Response, next: NextFunction) => {
  const userRepository = new UserRepository()
  const userTokenRepository = new UserTokenRepository()

  new CreateUserUseCase(userRepository)
    .execute(req.body)
    .then((user) =>
      new CreateUserTokenUseCase(userTokenRepository)
        .execute({ id: user.id, email: user.email, name: user.name, role: user.role })
    )
    .then(() => { resp.end() })
    .catch((err) => { next(err || {}) })
}

export default { activate, state, login, signup }
