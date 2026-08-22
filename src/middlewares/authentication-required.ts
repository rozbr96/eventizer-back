
import type { Request, Response, NextFunction } from 'express'

import { UserTokenRepository } from '@/redis/repositories/index.js'
import { AuthenticateUserUseCase } from '@/core/use-cases/index.js'

export default () => {
  return async (req: Request, _resp: Response, next: NextFunction) => {
    const { authorization } = req.headers

    if (!authorization) return next({ status: 401, detail: 'Unauthenticated' })

    const token = authorization.replace(/^Bearer /, '')
    const userTokenRepository = new UserTokenRepository()

    new AuthenticateUserUseCase(userTokenRepository)
      .execute(token)
      .then((userData) => {
        req.app.locals.user = userData

        next()
      }).catch(() => { next({ status: 401, detail: 'Unauthenticated' }) })
  }
}
