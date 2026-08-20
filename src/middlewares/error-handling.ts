
import type { Request, Response, NextFunction } from 'express'

export default (error: any, _req: Request, resp: Response, _next: NextFunction) => {
  if (error.details) {
    resp.status(400).json({ details: error.details })
  }
}
