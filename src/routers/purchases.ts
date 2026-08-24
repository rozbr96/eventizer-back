
import { Router } from 'express'
import { purchasesController } from '@/controllers/index.js'
import { authenticationRequired } from '@/middlewares/index.js'

const router = Router()

router.post('/', [
  authenticationRequired()
], purchasesController.start)


const purchaseRouter = Router({ mergeParams: true })
purchaseRouter.get('/', purchasesController.get)
purchaseRouter.post('/confirm-event', purchasesController.confirmEvent)
purchaseRouter.post('/supply-personal-info', purchasesController.supplyPersonalInfo)
purchaseRouter.post('/pay', purchasesController.pay)

router.use('/:purchaseId/', purchaseRouter)


export default router
