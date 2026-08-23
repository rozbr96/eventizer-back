
import request from 'supertest'
import { describe, expect, it } from 'vitest'

import app from '@/app.js'
import prismaClient from '@/prisma/client.js'
import { authenticate, createTicket, createUser } from '@test/helpers.js'

const doRequest = async (ticketCode: string, token: string = '') =>
  request(app).post(`/tickets/${ticketCode}/verify`).set('Cookie', `token=${token}`).send()

describe('POST /tickets/:ticket-id/verify', () => {
  it('verifies ticket', async () => {
    const user = await createUser()
    const token = await authenticate(user)
    const ticketToBeVerified = await createTicket()

    const { status } = await doRequest(ticketToBeVerified.code, token)
    const ticket = await prismaClient.ticket.findFirst()

    expect(status).toBe(200)
    expect(ticket?.consumed).toBeTruthy()
  })
})

