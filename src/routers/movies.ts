
import { Router } from 'express'
import * as zod from 'zod'

import { moviesController } from '@/controllers/index.js'
import {
  authenticationRequired,
  queryValidation
} from '@/middlewares/index.js'

const router = Router()

const movieSearchSchema = zod.object({
  query: zod.string().optional(),
  page: zod.coerce.number().min(1, { error: 'Must be positive' }).max(500, { error: 'Must be less than 500' }).optional(),
  year: zod.coerce.number().optional(),
  language: zod.string().optional(),
})

router.get('/', [
  authenticationRequired(),
  queryValidation(movieSearchSchema)
], moviesController.search)

export default router
