
import { Router } from 'express'

import * as zod from 'zod'

import { eventsController } from '@/controllers/index.js'
import authenticationRequired from '@/middlewares/authentication-required.js'
import bodyValidation from '@/middlewares/body-validation.js'

const router = Router()

const eventCreationSchema = zod.object({
  organizer_id: zod.number().or(zod.string()),
  event: zod.object({
    title: zod.string(),
    description: zod.string(),
    datetime: zod.iso.datetime(),
    address: zod.string(),
    address_title: zod.string(),
    capacity: zod.number().min(1, { error: 'Must be positive' }),
    price_in_cents: zod.number().min(1, { error: 'Must be positive' }),
    metadata: zod.any(),
  })
})

router.post('/', [
  authenticationRequired(),
  bodyValidation(eventCreationSchema),
], eventsController.create)

export default router

