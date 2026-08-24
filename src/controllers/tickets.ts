
import type { NextFunction, Request, Response } from 'express'

import {
  TicketRepository,
  TicketVerificationRepository
} from '@/prisma/repositories/index.js'
import {
  GetTicketUseCase,
  ListTicketVerificationsUseCase,
  VerifyTicketUseCase
} from '@/core/use-cases/index.js'

const get = (req: Request<{ ticketId: string }>, resp: Response, next: NextFunction) => {
  const ticketsRepostiory = new TicketRepository()

  new GetTicketUseCase(ticketsRepostiory)
    .execute(Number.parseInt(req.params.ticketId))
    .then((ticket) => { ticket ? resp.json(ticket) : resp.status(404).json() })
    .catch((err) => { next(err || {}) })
}

const verify = (req: Request, resp: Response, next: NextFunction) => {
  const ticketsRepostiory = new TicketRepository()
  const ticketVerificationRepository = new TicketVerificationRepository()

  new VerifyTicketUseCase(ticketsRepostiory, ticketVerificationRepository)
    .execute({
      code: req.body.code,
      document_number: req.body.document_number,
      verified_by_id: req.app.locals.user.id
    })
    .then(() => { resp.end() })
    .catch((err) => { next(err || {}) })
}

const listVerifications = (req: Request, resp: Response, next: NextFunction) => {
  const ticketVerificationRepository = new TicketVerificationRepository()

  new ListTicketVerificationsUseCase(ticketVerificationRepository)
    .execute({
      verifiedById: req.app.locals.user.id,
      page: req.app.locals.query.page,
      itemsPerPage: req.app.locals.query.itemsPerPage
    })
    .then((verifications) => { resp.json(verifications) })
    .catch((err) => { next(err || {}) })
}

export default { get, verify, listVerifications }
