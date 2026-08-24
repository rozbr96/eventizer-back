
import request from 'supertest'
import { describe, expect, it } from 'vitest'

import app from '@/app.js'
import { authenticate, createTicket, createUser } from '@test/helpers.js'

const doRequest = async (ticketId: number, token: string = '') =>
  request(app).get(`/tickets/${ticketId}`).set('Cookie', `token=${token}`).send()

describe('GET /tickets/:ticket-id', () => {
  it('gets ticket', async () => {
    const user = await createUser()
    const token = await authenticate(user)
    const ticket = await createTicket({ holder: 'Holder' })

    const { status, body } = await doRequest(ticket.id, token)

    expect(status).toBe(200)
    expect(body).toMatchObject({
      id: ticket.id,
      code: ticket.code,
      holder: 'Holder',
      consumed: false,
      purchase_id: ticket.purchase_id,
      event_id: ticket.event_id
    })
  })
})
