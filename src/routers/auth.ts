
import { Router } from 'express'
import * as zod from 'zod'

import bodyValidation from '@/middlewares/body-validation.js'
import { authController } from '@/controllers/index.js'

const router = Router()

const userSignupSchema = zod.object({
  name: zod.string().nonempty({ error: 'Cannot be blank' }),
  email: zod.email(),
  password: zod.string().nonempty({ error: 'Cannot be blank' })
})

const userActivationSchema = zod.object({
  email: zod.email(),
  token: zod.string().nonempty({ error: 'Cannot be blank' })
})

const userLoginSchema = zod.object({
  email: zod.email(),
  password: zod.string().nonempty({ error: 'Cannot be blank' })
})

router.post('/signup', [
  bodyValidation(userSignupSchema),
], authController.signup)

router.post('/activate', [
  bodyValidation(userActivationSchema)
], authController.activate)

router.post('/login', [
  bodyValidation(userLoginSchema),
], authController.login)

export default router
