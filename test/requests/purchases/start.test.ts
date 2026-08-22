
import request from 'supertest'
import { describe, expect, it } from 'vitest'

import app from '@/app.js'
import prismaClient from '@/prisma/client.js'
import { authenticate, createEvent, createUser } from '@test/helpers.js'

const doRequest = async (data: Object = {}, token: string = '') =>
  request(app).post('/purchases/start').set('Authorization', `Bearer ${token}`).send(data)

describe('POST /purchases/start', () => {
  describe('when authenticated', () => {
    it('starts purchase', async () => {
      const user = await createUser()
      const token = await authenticate(user)
      const events = await createEvent({})
      const event_id = events && events[0] && events[0].id

      const { status } = await doRequest({ event_id }, token)
      const purchase = await prismaClient.purchase.findFirst()

      expect(status).toBe(200)
      expect(purchase).toMatchObject({
        status: 'eventConfirmation',
        event_id, client_id: user.id
      })
    })
  })
})
