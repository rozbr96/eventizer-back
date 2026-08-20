
import type { Request, Response } from 'express'

import {
  ActivateUserUseCase,
  CreateUserUseCase,
  CreateUserTokenUseCase,
} from '@/core/use-cases/index.js'

import UserRepository from '@/prisma/repositories/user.js'
import UserTokenRepository from '@/redis/repositories/user-token.js'

const activate = (req: Request, resp: Response) => {
  const userRepository = new UserRepository()
  const userTokenRepository = new UserTokenRepository()

  new ActivateUserUseCase(userRepository, userTokenRepository)
    .execute(req.body)
    .then(() => { resp.end() })
    .catch((err) => { resp.status(400).json(err) })
}

const signup = (req: Request, resp: Response) => {
  const userRepository = new UserRepository()
  const userTokenRepository = new UserTokenRepository()

  new CreateUserUseCase(userRepository)
    .execute(req.body)
    .then(() => {
      new CreateUserTokenUseCase(userTokenRepository)
        .execute({ email: req.body.email })
        .then(() => { resp.end() })
    })
    .catch((err) => { resp.status(400).json(err) })
}

export default { activate, signup }

