import request from 'supertest'
import { describe, expect, it } from 'vitest'

import app from '@/app.js'
import { authenticate, createPurchase, createUser } from '@test/helpers.js'

const doRequest = async (token: string = '', query: Object = {}) =>
  request(app).get('/purchases').set('Cookie', `token=${token}`).query(query)

describe('GET /purchases', () => {
  it('lists logged in user purchases', async () => {
    const user = await createUser()
    const token = await authenticate(user)
    const otherUser = await createUser()

    const firstPurchase = await createPurchase({ client_id: user.id, holder: 'First Holder' })
    const secondPurchase = await createPurchase({ client_id: user.id, holder: 'Second Holder' })
    await createPurchase({ client_id: otherUser.id })

    const { status, body } = await doRequest(token)

    expect(status).toBe(200)
    expect(body).toMatchObject({
      page: 1,
      total_count: 2,
      total_pages: 1,
      items: [
        {
          id: firstPurchase.id,
          client_id: user.id,
          holder: 'First Holder',
          event: { id: firstPurchase.event_id }
        },
        {
          id: secondPurchase.id,
          client_id: user.id,
          holder: 'Second Holder',
          event: { id: secondPurchase.event_id }
        }
      ]
    })
  })

  it('returns purchases from requested page', async () => {
    const user = await createUser()
    const token = await authenticate(user)

    await createPurchase({ client_id: user.id, holder: 'First Holder' })
    const secondPurchase = await createPurchase({ client_id: user.id, holder: 'Second Holder' })
    const thirdPurchase = await createPurchase({ client_id: user.id, holder: 'Third Holder' })

    const { status, body } = await doRequest(token, { page: 2, itemsPerPage: 2 })

    expect(status).toBe(200)
    expect(body).toMatchObject({
      page: 2,
      total_count: 3,
      total_pages: 2,
      items: [
        {
          id: thirdPurchase.id,
          client_id: user.id,
          holder: 'Third Holder'
        }
      ]
    })
    expect(body.items).not.toContainEqual(expect.objectContaining({ id: secondPurchase.id }))
  })

  it('returns an empty page', async () => {
    const user = await createUser()
    const token = await authenticate(user)

    await createPurchase({ client_id: user.id })

    const { status, body } = await doRequest(token, { page: 2 })

    expect(status).toBe(200)
    expect(body).toStrictEqual({
      page: 2,
      total_count: 1,
      total_pages: 1,
      items: []
    })
  })

  it('fails without authentication', async () => {
    const { status, body } = await doRequest()

    expect(status).toBe(401)
    expect(body).toStrictEqual({ detail: 'Unauthenticated' })
  })
})
