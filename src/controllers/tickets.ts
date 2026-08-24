
import type { NextFunction, Request, Response } from 'express'

import { TicketRepository } from '@/prisma/repositories/index.js'
import { GetTicketUseCase, VerifyTicketUseCase } from '@/core/use-cases/index.js'

const get = (req: Request<{ ticketId: string }>, resp: Response, next: NextFunction) => {
  const ticketsRepostiory = new TicketRepository()

  new GetTicketUseCase(ticketsRepostiory)
    .execute(Number.parseInt(req.params.ticketId))
    .then((ticket) => { ticket ? resp.json(ticket) : resp.status(404).json() })
    .catch((err) => { next(err || {}) })
}

const verify = (req: Request<{ code: string }>, resp: Response, next: NextFunction) => {
  const ticketsRepostiory = new TicketRepository()

  new VerifyTicketUseCase(ticketsRepostiory)
    .execute({ code: req.params.code })
    .then(() => { resp.end() })
    .catch((err) => { next(err || {}) })
}

export default { get, verify }
