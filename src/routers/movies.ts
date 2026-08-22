
import { Router } from 'express'
import * as zod from 'zod'

import controller from '@/controllers/movies.js'
import bodyValidation from '@/middlewares/body-validation.js'
import authenticationRequired from '@/middlewares/authentication-required.js'

const router = Router()

const movieSearchSchema = zod.object({
  query: zod.string().optional(),
  page: zod.number().min(1, { error: 'Must be positive' }).max(500, { error: 'Must be less than 500' }).optional(),
  year: zod.number().optional(),
  language: zod.string().optional(),
})

router.post('/search', [
  authenticationRequired(),
  bodyValidation(movieSearchSchema)
], controller.search)

export default router

