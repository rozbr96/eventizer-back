
import request from 'supertest'
import { describe, expect, it } from 'vitest'

import app from '@/app.js'
import prismaClient from '@/prisma/client.js'
import { authenticate, createEvent, createUser } from '@test/helpers.js'

const doRequest = async (purchaseId: number, data: Object = {}, token: string = '') =>
  request(app).post(`/purchases/${purchaseId}/supply-personal-info`).set('Cookie', `token=${token}`).send(data)

describe('POST /purchases/:purchase-id/supply-personal-info', () => {
  describe('when authenticated', () => {
    it('moves purchase to next step', async () => {
      const user = await createUser()
      const token = await authenticate(user)
      const event = await createEvent()

      const { id: purchaseId } = await prismaClient.purchase.create({
        data: {
          event: { connect: { id: event.id } },
          client: { connect: { id: user.id } },
          status: 'personalInfoSupplying'
        }
      })

      const { status, body } = await doRequest(purchaseId, { holder: 'Holder' }, token)
      const purchase = await prismaClient.purchase.findFirst()

      expect(status).toBe(200)
      expect(purchase).toMatchObject({ holder: 'Holder', status: 'payment' })
      expect(body).toMatchObject({
        id: purchaseId,
        holder: 'Holder',
        status: 'payment',
        event_id: event.id,
        client_id: user.id
      })
    })
  })
})
