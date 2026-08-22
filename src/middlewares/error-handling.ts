
import type { Request, Response, NextFunction } from 'express'

export default (error: any, _req: Request, resp: Response, _next: NextFunction) => {
  const data: { [key: string]: any } = {}
  const status = error.status || 400

  if (error.details) data.details = error.details
  if (error.detail) data.detail = error.detail

  resp.status(status).json(data)
}
