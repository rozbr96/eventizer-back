
import { Router } from 'express'

import controller from '@/controllers/movies.js'

const router = Router()

router.post('/search', controller.search)

export default router

