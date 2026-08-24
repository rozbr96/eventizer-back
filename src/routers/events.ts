
import { Router } from 'express'

import * as zod from 'zod'

import { eventsController } from '@/controllers/index.js'
import { authenticationRequired, paramsValidation, queryValidation } from '@/middlewares/index.js'
import { bodyValidation } from '@/middlewares/index.js'

const router = Router()

const eventCreationSchema = zod.object({
  event: zod.object({
    title: zod.string(),
    description: zod.string(),
    datetime: zod.iso.datetime()
      .refine((datetime) => {
        const date = new Date(datetime)

        if (Number.isNaN(date.getTime())) return true

        return date > new Date()
      }, { error: 'Must be a future date' }),
    address: zod.string(),
    address_title: zod.string(),
    capacity: zod.number().min(1, { error: 'Must be positive' }),
    price_in_cents: zod.number().min(0, { error: 'Must not be negative' }),
    metadata: zod.any(),
  })
})

const eventListingParamsSchema = zod.object({
  page: zod.string().transform((page) => Number.parseInt(page.replaceAll(/\D/g, '') || '1')).optional(),
  itemsPerPage: zod.string().transform((page) => Number.parseInt(page.replaceAll(/\D/g, '') || '1')).optional()
})

const eventRetrievalParamsSchema = zod.object({
  event_id: zod.string().transform(id => id.replaceAll(/\D/g, '') || '0').transform(id => Number.parseInt(id))
})

router.post('/', [
  authenticationRequired(),
  bodyValidation(eventCreationSchema),
], eventsController.create)

router.get('/', [
  queryValidation(eventListingParamsSchema),
], eventsController.list)

router.get('/:event_id', [
  paramsValidation(eventRetrievalParamsSchema),
], eventsController.get)

export default router
