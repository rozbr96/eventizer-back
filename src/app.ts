
import express from 'express'

import {
  authRouter,
  eventsRouter,
  moviesRouter,
  purchasesRouter
} from '@/routers/index.js'

import { errorHandling } from '@/middlewares/index.js'

const app = express()

app.use(express.json())

app.use('/auth', authRouter)
app.use('/events', eventsRouter)
app.use('/movies', moviesRouter)
app.use('/purchases', purchasesRouter)

app.use(errorHandling)

export default app

