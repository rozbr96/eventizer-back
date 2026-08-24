
import type { Request, Response, NextFunction } from 'express'

export default (error: any, req: Request, resp: Response, _next: NextFunction) => {
  console.error({
    error,
    body: req.body,
    params: req.params,
    query: req.query
  })

  const data: { [key: string]: any } = {}
  const status = error.status || 400

  if (error.details) data.details = error.details
  if (error.detail) data.detail = error.detail

  resp.status(status).json(data)
}
