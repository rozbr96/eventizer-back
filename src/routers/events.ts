
import { Router } from 'express'

import eventsController from '@/controllers/events.js'
import authenticationRequired from '@/middlewares/authentication-required.js'

const router = Router()

router.post('/', [
  authenticationRequired()
], eventsController.create)

export default router

