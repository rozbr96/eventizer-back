
import { Router } from 'express'
import * as zod from 'zod'

import { purchasesController } from '@/controllers/index.js'
import { authenticationRequired, queryValidation } from '@/middlewares/index.js'

const router = Router()

const purchaseListingParamsSchema = zod.object({
  page: zod.string().transform((page) => Number.parseInt(page.replaceAll(/\D/g, '') || '1')).optional(),
  itemsPerPage: zod.string().transform((page) => Number.parseInt(page.replaceAll(/\D/g, '') || '1')).optional()
})

router.post('/', [
  authenticationRequired()
], purchasesController.start)

router.get('/', [
  authenticationRequired(),
  queryValidation(purchaseListingParamsSchema)
], purchasesController.list)

const purchaseRouter = Router({ mergeParams: true })
purchaseRouter.get('/', purchasesController.get)
purchaseRouter.post('/confirm-event', purchasesController.confirmEvent)
purchaseRouter.post('/supply-personal-info', purchasesController.supplyPersonalInfo)
purchaseRouter.post('/pay', purchasesController.pay)

router.use('/:purchaseId/', purchaseRouter)


export default router
