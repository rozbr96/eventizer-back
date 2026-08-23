
import type { Request, Response } from 'express'

import { TicketRepository } from '@/prisma/repositories/index.js'
import { VerifyTicketUseCase } from '@/core/use-cases/ticket/verify.js'

const verify = (req: Request<{ code: string }>, resp: Response) => {
  const ticketsRepostiory = new TicketRepository()

  new VerifyTicketUseCase(ticketsRepostiory)
    .execute({ code: req.params.code })
    .then(() => { resp.end() })
}

export default { verify }

