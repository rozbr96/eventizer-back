
import type { Request, Response } from 'express'

import { PurchaseRepository } from '@/prisma/repositories/index.js'
import { StartPurchaseUseCase } from '@/core/use-cases/index.js'

const start = (req: Request, resp: Response) => {
  const purchaseRepository = new PurchaseRepository()

  const { event_id } = req.body
  const { id: client_id } = req.app.locals.user

  new StartPurchaseUseCase(purchaseRepository)
    .execute({ event_id, client_id })
    .then(() => { resp.status(201).end() })
    .catch((err) => { resp.status(400).json(err) })
}

export default { start }

