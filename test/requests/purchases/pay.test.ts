
import request from 'supertest'
import { describe, expect, it } from 'vitest'

import app from '@/app.js'
import prismaClient from '@/prisma/client.js'
import { authenticate, createEvent, createUser } from '@test/helpers.js'

const doRequest = async (purchaseId: number, data: Object = {}, token: string = '') =>
  request(app).post(`/purchases/${purchaseId}/pay`).set('Cookie', `token=${token}`).send(data)

describe('POST /purchases/:purchase-id/pay', () => {
  describe('when authenticated', () => {
    it('moves purchase to next step', async () => {
      const user = await createUser()
      const token = await authenticate(user)
      const event = await createEvent()

      const { id: purchaseId } = await prismaClient.purchase.create({
        data: {
          holder: 'Holder',
          status: 'payment',
          event: { connect: { id: event.id } },
          client: { connect: { id: user.id } }
        }
      })

      const { status } = await doRequest(purchaseId, {}, token)
      const purchase = await prismaClient.purchase.findFirst()
      const ticket = await prismaClient.ticket.findFirst()

      expect(status).toBe(200)
      expect(purchase?.status).toBe('done')
      expect(ticket?.code).not.toBeNull()
      expect(ticket).toMatchObject({
        purchase_id: purchaseId,
        event_id: event.id,
        holder: 'Holder',
        consumed: false
      })
    })

    it('fails due to wrong step', async () => {
      const user = await createUser()
      const token = await authenticate(user)
      const event = await createEvent()

      const { id: purchaseId } = await prismaClient.purchase.create({
        data: {
          holder: 'Holder',
          event: { connect: { id: event.id } },
          client: { connect: { id: user.id } }
        }
      })

      const { status, body } = await doRequest(purchaseId, {}, token)
      const purchase = await prismaClient.purchase.findFirst()
      const ticket = await prismaClient.ticket.findFirst()

      expect(status).toBe(403)
      expect(body).toStrictEqual({ detail: 'Wrong step' })
      expect(purchase?.status).toBe('eventConfirmation')
      expect(ticket).toBeNull()
    })
  })
})
