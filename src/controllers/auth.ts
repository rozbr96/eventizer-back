
import type { Request, Response } from 'express'

import { CreateUserUseCase } from '@/core/use-cases/user/index.js'
import UserRepository from '@/prisma/repositories/user.js'

import { CreateUserTokenUseCase } from '@/core/use-cases/index.js'
import UserTokenRepository from '@/redis/repositories/user-token.js'

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

export default { signup }

