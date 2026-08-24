
import request from 'supertest'
import { describe, expect, it } from 'vitest'

import app from '@/app.js'
import prismaClient from '@/prisma/client.js'
import { authenticate, createTicket, createUser } from '@test/helpers.js'

const doRequest = async (data: Object = {}, token: string = '') =>
  request(app).post('/tickets/verify').set('Cookie', `token=${token}`).send(data)

describe('POST /tickets/verify', () => {
  it('verifies ticket', async () => {
    const user = await createUser()
    const token = await authenticate(user)
    const documentNumber = '123456789'
    const ticketToBeVerified = await createTicket({ document_number: documentNumber })

    const { status } = await doRequest(
      {
        code: ticketToBeVerified.code,
        document_number: documentNumber
      },
      token
    )
    const ticket = await prismaClient.ticket.findFirst()
    const verification = await prismaClient.ticketVerification.findFirst()

    expect(status).toBe(200)
    expect(ticket?.consumed).toBeTruthy()
    expect(verification).toMatchObject({
      ticket_id: ticketToBeVerified.id,
      verified_by_id: user.id,
      document_number: documentNumber,
      succeed: true
    })
    expect(verification?.when).toBeInstanceOf(Date)
  })

  it('does not verify ticket with invalid document number', async () => {
    const user = await createUser()
    const token = await authenticate(user)
    const ticketToBeVerified = await createTicket({ document_number: '123456789' })

    const { status, body } = await doRequest(
      {
        code: ticketToBeVerified.code,
        document_number: '000000000'
      },
      token
    )
    const ticket = await prismaClient.ticket.findFirst()
    const verification = await prismaClient.ticketVerification.findFirst()

    expect(status).toBe(400)
    expect(body).toStrictEqual({ detail: 'Invalid Document' })
    expect(ticket?.consumed).toBeFalsy()
    expect(verification).toMatchObject({
      ticket_id: ticketToBeVerified.id,
      verified_by_id: user.id,
      document_number: '000000000',
      succeed: false
    })
  })

  it('does not verify consumed ticket', async () => {
    const user = await createUser()
    const token = await authenticate(user)
    const documentNumber = '123456789'
    const ticketToBeVerified = await createTicket({
      document_number: documentNumber,
      consumed: true
    })

    const { status, body } = await doRequest(
      {
        code: ticketToBeVerified.code,
        document_number: documentNumber
      },
      token
    )
    const verification = await prismaClient.ticketVerification.findFirst()

    expect(status).toBe(400)
    expect(body).toStrictEqual({ detail: 'Ticket already used' })
    expect(verification).toMatchObject({
      ticket_id: ticketToBeVerified.id,
      verified_by_id: user.id,
      document_number: documentNumber,
      succeed: false
    })
  })

  it('does not verify ticket when unauthenticated', async () => {
    const ticketToBeVerified = await createTicket()

    const { status, body } = await doRequest(
      {
        code: ticketToBeVerified.code,
        document_number: ticketToBeVerified.document_number
      }
    )
    const verificationsCount = await prismaClient.ticketVerification.count()

    expect(status).toBe(401)
    expect(body).toStrictEqual({ detail: 'Unauthenticated' })
    expect(verificationsCount).toBe(0)
  })

  it('requires document number', async () => {
    const user = await createUser()
    const token = await authenticate(user)
    const ticketToBeVerified = await createTicket()

    const { status, body } = await doRequest(
      {
        code: ticketToBeVerified.code,
        document_number: ''
      },
      token
    )
    const verificationsCount = await prismaClient.ticketVerification.count()

    expect(status).toBe(400)
    expect(body).toStrictEqual({ details: ['[document_number] Cannot be blank'] })
    expect(verificationsCount).toBe(0)
  })

  it('requires ticket code', async () => {
    const user = await createUser()
    const token = await authenticate(user)

    const { status, body } = await doRequest(
      {
        code: '',
        document_number: '123456789'
      },
      token
    )
    const verificationsCount = await prismaClient.ticketVerification.count()

    expect(status).toBe(400)
    expect(body).toStrictEqual({ details: ['[code] Cannot be blank'] })
    expect(verificationsCount).toBe(0)
  })
})
