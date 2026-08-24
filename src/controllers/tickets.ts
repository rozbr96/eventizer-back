
import type { NextFunction, Request, Response } from 'express'

import { TicketRepository } from '@/prisma/repositories/index.js'
import { VerifyTicketUseCase } from '@/core/use-cases/ticket/verify.js'

const verify = (req: Request<{ code: string }>, resp: Response, next: NextFunction) => {
  const ticketsRepostiory = new TicketRepository()

  new VerifyTicketUseCase(ticketsRepostiory)
    .execute({ code: req.params.code })
    .then(() => { resp.end() })
    .catch((err) => { next(err || {}) })
}

export default { verify }
