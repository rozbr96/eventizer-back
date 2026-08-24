
import request from 'supertest'
import { describe, expect, it } from 'vitest'

import app from '@/app.js'
import prismaClient from '@/prisma/client.js'
import { authenticate, createEvent, createPurchase, createUser } from '@test/helpers.js'

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

    it('fails when event has no slots available', async () => {
      const user = await createUser()
      const token = await authenticate(user)
      const { id: event_id } = await createEvent({ data: { capacity: 1 } })

      await createPurchase({ event_id, status: 'payment' })

      const { status, body } = await doRequest({ event_id }, token)
      const purchasesCount = await prismaClient.purchase.count({ where: { event_id } })

      expect(status).toBe(400)
      expect(body).toStrictEqual({ detail: 'Sem Vagas' })
      expect(purchasesCount).toBe(1)
    })

    it('ignores expired unfinished purchases when checking slots', async () => {
      const user = await createUser()
      const token = await authenticate(user)
      const { id: event_id } = await createEvent({ data: { capacity: 1 } })

      await createPurchase({
        event_id,
        status: 'payment',
        expires_at: new Date(Date.now() - 60 * 1000)
      })

      const { status, body } = await doRequest({ event_id }, token)

      expect(status).toBe(201)
      expect(body).toMatchObject({ event_id, client_id: user.id })
    })

    it('counts done purchases even when expired', async () => {
      const user = await createUser()
      const token = await authenticate(user)
      const { id: event_id } = await createEvent({ data: { capacity: 1 } })

      await createPurchase({
        event_id,
        status: 'done',
        expires_at: new Date(Date.now() - 60 * 1000)
      })

      const { status, body } = await doRequest({ event_id }, token)
      const purchasesCount = await prismaClient.purchase.count({ where: { event_id } })

      expect(status).toBe(400)
      expect(body).toStrictEqual({ detail: 'Sem Vagas' })
      expect(purchasesCount).toBe(1)
    })
  })
})
