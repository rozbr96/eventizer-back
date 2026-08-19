
import express from 'express'

const app = express()

app.get('/', (_req, resp) => {
  resp.end()
})

app.listen(3000)

