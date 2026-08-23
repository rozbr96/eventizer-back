
import type { Request, Response } from 'express'

import { PurchaseRepository } from '@/prisma/repositories/index.js'
import { StartPurchaseUseCase } from '@/core/use-cases/index.js'
import { AdvancePurchaseStep } from '@/core/use-cases/purchase/advance-step.js'

const start = (req: Request, resp: Response) => {
  const purchaseRepository = new PurchaseRepository()

  const { event_id } = req.body
  const { id: client_id } = req.app.locals.user

  new StartPurchaseUseCase(purchaseRepository)
    .execute({ event_id, client_id })
    .then(() => { resp.status(201).end() })
    .catch((err) => { resp.status(400).json(err) })
}

const confirmEvent = (req: Request<{ purchaseId: string }>, resp: Response) => {
  const purchaseRepository = new PurchaseRepository()

  const purchaseId = Number.parseInt(req.params.purchaseId)

  new AdvancePurchaseStep(purchaseRepository)
    .execute({ status: 'personalInfoSupplying', id: purchaseId })
    .then(() => { resp.end() })
}

const supplyPersonalInfo = (req: Request<{ purchaseId: string }>, resp: Response) => {
  const purchaseRepository = new PurchaseRepository()

  const purchaseId = Number.parseInt(req.params.purchaseId)

  new AdvancePurchaseStep(purchaseRepository)
    .execute({ status: 'payment', id: purchaseId, holder: req.body.holder })
    .then(() => { resp.end() })
}

const pay = (req: Request<{ purchaseId: string }>, resp: Response) => {
  const purchaseRepository = new PurchaseRepository()

  const purchaseId = Number.parseInt(req.params.purchaseId)

  new AdvancePurchaseStep(purchaseRepository)
    .execute({ status: 'done', id: purchaseId })
    .then(() => { resp.end() })
}

export default { start, confirmEvent, supplyPersonalInfo, pay }

