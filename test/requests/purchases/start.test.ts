
import request from 'supertest'
import { describe, expect, it } from 'vitest'

import app from '@/app.js'
import prismaClient from '@/prisma/client.js'
import { authenticate, createEvent, createUser } from '@test/helpers.js'

const doRequest = async (data: Object = {}, token: string = '') =>
  request(app).post('/purchases').set('Cookie', `token=${token}`).send(data)

describe('POST /purchases', () => {
  describe('when authenticated', () => {
    it('starts purchase', async () => {
      const user = await createUser()
      const token = await authenticate(user)
      const { id: event_id } = await createEvent({})

      const { status, body } = await doRequest({ event_id }, token)
      const purchase = await prismaClient.purchase.findFirst()

      expect(status).toBe(201)
      expect(purchase).toMatchObject({
        status: 'eventConfirmation',
        event_id, client_id: user.id
      })
      expect(body).toMatchObject({
        id: purchase?.id,
        status: 'eventConfirmation',
        event_id,
        client_id: user.id
      })
    })
  })
})
