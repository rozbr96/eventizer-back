
import { createClient } from 'redis'

const { REDIS_HOST, REDIS_PORT } = process.env

const client = await createClient({
  url: `redis://${REDIS_HOST}:${REDIS_PORT}`
}).connect()

export default client

