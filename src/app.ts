
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import {
  authRouter,
  eventsRouter,
  moviesRouter,
  purchasesRouter,
  ticketsRouter
} from '@/routers/index.js'

import { errorHandling } from '@/middlewares/index.js'

const app = express()

const logConfig = process.env.ENV === 'dev' ? 'dev' : 'tiny'
const allowedHosts = (process.env.ALLOWED_HOSTS || '').split(',')

app.use(cors({
  origin(requestOrigin, callback) {
    if (!requestOrigin) return callback(null, true)
    if (allowedHosts.includes(requestOrigin)) return callback(null, true)

    callback(new Error(`Host [${requestOrigin}] not allowed!`))
  }
}))

app.use(morgan(logConfig))
app.use(express.json())
app.use(cookieParser())

app.use('/auth', authRouter)
app.use('/events', eventsRouter)
app.use('/movies', moviesRouter)
app.use('/purchases', purchasesRouter)
app.use('/tickets', ticketsRouter)

app.use(errorHandling)

export default app

