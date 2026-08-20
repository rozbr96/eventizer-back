
import express from 'express'

import { authRouter } from '@/routers/index.js'

const app = express()

app.use(express.json())

app.use('/auth', authRouter)

export default app

