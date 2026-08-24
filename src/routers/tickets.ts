
import { Router } from 'express'
import * as zod from 'zod'

import { ticketsController } from '@/controllers/index.js'
import { authenticationRequired, bodyValidation } from '@/middlewares/index.js'

const router = Router()
const ticketRouter = Router({ mergeParams: true })

const ticketVerificationSchema = zod.object({
  document_number: zod.string().nonempty({ error: 'Cannot be blank' })
})

router.get('/:ticketId', ticketsController.get)

ticketRouter.post('/verify', [
  authenticationRequired(),
  bodyValidation(ticketVerificationSchema)
], ticketsController.verify)

router.use('/:code', ticketRouter)

export default router
