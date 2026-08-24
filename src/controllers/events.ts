
import type { NextFunction, Request, Response } from 'express'

import { EventRepository } from '@/prisma/repositories/index.js'
import { CreateEventUseCase, GetEventUseCase, ListEventsUseCase } from '@/core/use-cases/index.js'

const create = (req: Request, resp: Response, next: NextFunction) => {
  const eventRepository = new EventRepository()

  new CreateEventUseCase(eventRepository)
    .execute(req.body.event, req.app.locals.user.id)
    .then(() => { resp.status(201).end() })
    .catch((err) => { next(err || {}) })
}

const get = (req: Request<{ event_id: string }>, resp: Response, next: NextFunction) => {
  const eventRepository = new EventRepository()

  new GetEventUseCase(eventRepository)
    .execute(Number.parseInt(req.params.event_id))
    .then((event) => {
      event ? resp.json(event).end() : resp.status(404).json()
    })
    .catch((err) => { next(err || {}) })
}

const list = (req: Request, resp: Response, next: NextFunction) => {
  const eventRepository = new EventRepository()

  new ListEventsUseCase(eventRepository)
    .execute(req.app.locals.query)
    .then((result) => { resp.json(result) })
    .catch((err) => { next(err || {}) })
}

export default { create, get, list }
