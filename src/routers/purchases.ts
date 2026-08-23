
import { Router } from 'express'
import { purchasesController } from '@/controllers/index.js'
import { authenticationRequired } from '@/middlewares/index.js'

const router = Router()

router.post('/', [
  authenticationRequired()
], purchasesController.start)


const purchaseRouter = Router({ mergeParams: true })
purchaseRouter.post('/confirm-event', purchasesController.confirmEvent)

router.use('/:purchaseId/', purchaseRouter)


export default router
