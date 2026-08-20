
import type { Request, Response } from 'express'

import { CreateUserUseCase } from '@/core/use-cases/user/index.js'
import UserRepository from '@/prisma/repositories/user.js'

const signup = (req: Request, resp: Response) => {
  const userRepository = new UserRepository()

  new CreateUserUseCase(userRepository)
    .execute(req.body)
    .then(() => { resp.end() })
}

export default { signup }

