
import type { NextFunction, Request, Response } from 'express'

import { EventRepository, PurchaseRepository, TicketRepository } from '@/prisma/repositories/index.js'
import {
  AdvancePurchaseStep,
  GetPurchaseUseCase,
  ListPurchasesUseCase,
  StartPurchaseUseCase
} from '@/core/use-cases/index.js'

const purchaseRepository = new PurchaseRepository()
const ticketRepository = new TicketRepository()
const eventRepository = new EventRepository()

const get = (req: Request<{ purchaseId: string }>, resp: Response, next: NextFunction) => {
  const purchase_id = Number.parseInt(req.params.purchaseId)

  new GetPurchaseUseCase(purchaseRepository)
    .execute(purchase_id)
    .then((purchase) => { resp.json(purchase) })
    .catch((err) => { next(err || {}) })
}

const list = (req: Request, resp: Response, next: NextFunction) => {
  const { id: clientId } = req.app.locals.user

  new ListPurchasesUseCase(purchaseRepository)
    .execute({
      clientId,
      page: req.app.locals.query.page,
      itemsPerPage: req.app.locals.query.itemsPerPage
    })
    .then((purchases) => { resp.json(purchases) })
    .catch((err) => { next(err || {}) })
}

const start = (req: Request, resp: Response, next: NextFunction) => {
  const { event_id } = req.body
  const { id: client_id } = req.app.locals.user

  new StartPurchaseUseCase(purchaseRepository, eventRepository)
    .execute({ event_id, client_id })
    .then((purchase) => { resp.status(201).json(purchase) })
    .catch((err) => { next(err || {}) })
}

const confirmEvent = (req: Request<{ purchaseId: string }>, resp: Response, next: NextFunction) => {
  const purchaseId = Number.parseInt(req.params.purchaseId)

  new AdvancePurchaseStep(purchaseRepository, ticketRepository)
    .execute({ status: 'personalInfoSupplying', id: purchaseId })
    .then(() => { resp.end() })
    .catch((err) => { next(err || {}) })
}

const supplyPersonalInfo = (req: Request<{ purchaseId: string }>, resp: Response, next: NextFunction) => {
  const purchaseId = Number.parseInt(req.params.purchaseId)

  new AdvancePurchaseStep(purchaseRepository, ticketRepository)
    .execute({ status: 'payment', id: purchaseId, holder: req.body.holder, document_number: req.body.document_number })
    .then((purchase) => { resp.json(purchase) })
    .catch((err) => { next(err || {}) })
}

const pay = (req: Request<{ purchaseId: string }>, resp: Response, next: NextFunction) => {
  const purchaseId = Number.parseInt(req.params.purchaseId)

  new AdvancePurchaseStep(purchaseRepository, ticketRepository)
    .execute({ status: 'done', id: purchaseId })
    .then((ticket) => { resp.json(ticket).end() })
    .catch((err) => { next(err || {}) })
}

export default { get, list, start, confirmEvent, supplyPersonalInfo, pay }
