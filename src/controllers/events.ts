
import type { Request, Response } from 'express'

import { EventRepository } from '@/prisma/repositories/index.js'
import { CreateEventUseCase, ListEventsUseCase } from '@/core/use-cases/index.js'

const create = (req: Request, resp: Response) => {
  const eventRepository = new EventRepository()

  new CreateEventUseCase(eventRepository)
    .execute(req.body.event, req.app.locals.user.id)
    .then(() => { resp.status(201).end() })
    .catch((err) => { resp.status(400).json(err) })
}

const list = (req: Request, resp: Response) => {
  const eventRepository = new EventRepository()

  new ListEventsUseCase(eventRepository)
    .execute(req.app.locals.query)
    .then((result) => { resp.json(result) })
}

export default { create, list }

