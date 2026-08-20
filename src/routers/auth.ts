
import { Router } from 'express'
import * as zod from 'zod'

import bodyValidation from '@/middlewares/body-validation.js'
import authController from '@/controllers/auth.js'

const router = Router()

const userSignupSchema = zod.object({
  name: zod.string().nonempty({ error: 'Cannot be blank' }),
  email: zod.email(),
  password: zod.string().nonempty({ error: 'Cannot be blank' })
})

router.post('/signup', [
  bodyValidation(userSignupSchema),
], authController.signup)

export default router
