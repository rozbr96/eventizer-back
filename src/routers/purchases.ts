
import { Router } from 'express'
import { purchasesController } from '@/controllers/index.js'
import { authenticationRequired } from '@/middlewares/index.js'

const router = Router()

router.post('/start', [
  authenticationRequired()
], purchasesController.start)

export default router
