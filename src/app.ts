
import express from 'express'

import {
  authRouter,
  eventsRouter,
  moviesRouter,
  purchasesRouter,
  ticketsRouter
} from '@/routers/index.js'

import { errorHandling } from '@/middlewares/index.js'

const app = express()

app.use(express.json())

app.use('/auth', authRouter)
app.use('/events', eventsRouter)
app.use('/movies', moviesRouter)
app.use('/purchases', purchasesRouter)
app.use('/tickets', ticketsRouter)

app.use(errorHandling)

export default app

