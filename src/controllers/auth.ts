
import type { NextFunction, Request, Response } from 'express'

import {
  ActivateUserUseCase,
  CreateUserUseCase,
  DeleteUserTokenUseCase,
  LoginUserUseCase,
  SendActivationEmailUseCase,
} from '@/core/use-cases/index.js'

import { UserRepository } from '@/prisma/repositories/index.js'
import { MailerRepository } from '@/lib/mailer/index.js'
import {
  UserActivationTokenRepository,
  UserTokenRepository
} from '@/redis/repositories/index.js'

const activate = (req: Request, resp: Response, next: NextFunction) => {
  const userRepository = new UserRepository()
  const activationTokenRepository = new UserActivationTokenRepository()

  new ActivateUserUseCase(userRepository, activationTokenRepository)
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

const logout = (req: Request, resp: Response, next: NextFunction) => {
  const userTokenRepository = new UserTokenRepository()

  new DeleteUserTokenUseCase(userTokenRepository)
    .execute(req.app.locals.user)
    .then(() => {
      resp.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      }).end()
    })
    .catch((err) => { next(err || {}) })
}

const signup = (req: Request, resp: Response, next: NextFunction) => {
  const userRepository = new UserRepository()
  const activationTokenRepository = new UserActivationTokenRepository()
  const mailerRepository = new MailerRepository()

  new CreateUserUseCase(userRepository)
    .execute(req.body)
    .then((user) =>
      new SendActivationEmailUseCase(activationTokenRepository, mailerRepository)
        .execute({ user })
    )
    .then(() => { resp.end() })
    .catch((err) => { next(err || {}) })
}

export default { activate, state, login, logout, signup }
