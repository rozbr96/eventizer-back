
import type { ZodObject } from 'zod'
import type { Request, Response, NextFunction } from 'express'

export default (src: 'query' | 'body' | 'params') => {
  return (schema: ZodObject) => {
    return async (req: Request, _resp: Response, next: NextFunction) => {
      const result = await schema.safeParseAsync(req[src])

      if (result.success) {
        if (src === 'query')
          req.app.locals.query = result.data
        else if (src === 'params')
          Object.assign(req.params, result.data)
        else
          req.body = result.data

        return next()
      }

      const details = result.error.issues
        .map(({ message, path }) => `[${path.join('.')}] ${message}`)

      next({ details })
    }
  }
}
