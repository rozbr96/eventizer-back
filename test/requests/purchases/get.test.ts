
import request from 'supertest'
import { describe, expect, it } from 'vitest'

import app from '@/app.js'
import { authenticate, createPurchase, createUser } from '@test/helpers.js'

const doRequest = async (purchaseId: number, token: string = '') =>
  request(app).get(`/purchases/${purchaseId}`).set('Cookie', `token=${token}`)

describe('GET /purchases/:purchase-id', () => {
  describe('when authenticated', () => {
    it('gets purchase', async () => {
      const user = await createUser()
      const token = await authenticate(user)
      const purchase = await createPurchase({ client_id: user.id, holder: 'Holder' })

      const { status, body } = await doRequest(purchase.id, token)

      expect(status).toBe(200)
      expect(body).toMatchObject({
        id: purchase.id,
        status: purchase.status,
        holder: 'Holder',
        client_id: user.id,
        event_id: purchase.event_id,
        client: {
          id: user.id,
          email: user.email
        },
        event: {
          id: purchase.event_id,
          organizer: {
            id: purchase.event.organizer.id
          }
        }
      })
    })
  })
})
