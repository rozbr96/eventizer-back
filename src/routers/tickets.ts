
import { Router } from 'express'
import { ticketsController } from '@/controllers/index.js'

const router = Router()
const ticketRouter = Router({ mergeParams: true })

ticketRouter.post('/verify', ticketsController.verify)

router.use('/:code', ticketRouter)

export default router
