
import express from 'express'

import { authRouter } from '@/routers/index.js'
import errorHandling from '@/middlewares/error-handling.js'

const app = express()

app.use(express.json())

app.use('/auth', authRouter)
app.use(errorHandling)

export default app

