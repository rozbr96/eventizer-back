
import type { ZodObject } from 'zod'
import type { Request, Response, NextFunction } from 'express'

export default (schema: ZodObject) => {
  return async (req: Request, _resp: Response, next: NextFunction) => {
    const result = await schema.safeParseAsync(req.body)

    if (result.success) {
      req.body = result.data
      return next()
    }

    const details = result.error.issues
      .map(({ message, path }) => `[${path.join('.')}] ${message}`)

    next({ details })
  }
}
