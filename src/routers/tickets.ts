
import { Router } from 'express'
import * as zod from 'zod'

import { ticketsController } from '@/controllers/index.js'
import { authenticationRequired, bodyValidation, queryValidation } from '@/middlewares/index.js'

const router = Router()

const ticketVerificationSchema = zod.object({
  code: zod.string().nonempty({ error: 'Cannot be blank' }),
  document_number: zod.string().nonempty({ error: 'Cannot be blank' })
})

const ticketVerificationListingParamsSchema = zod.object({
  page: zod.string().transform((page) => Number.parseInt(page.replaceAll(/\D/g, '') || '1')).optional(),
  itemsPerPage: zod.string().transform((page) => Number.parseInt(page.replaceAll(/\D/g, '') || '1')).optional()
})

router.get('/verifications', [
  authenticationRequired(),
  queryValidation(ticketVerificationListingParamsSchema)
], ticketsController.listVerifications)

router.get('/:ticketId', ticketsController.get)

router.post('/verify', [
  authenticationRequired(),
  bodyValidation(ticketVerificationSchema)
], ticketsController.verify)

export default router
