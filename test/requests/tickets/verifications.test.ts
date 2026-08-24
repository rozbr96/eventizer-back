import request from 'supertest'
import { describe, expect, it } from 'vitest'

import app from '@/app.js'
import prismaClient from '@/prisma/client.js'
import { authenticate, createTicket, createUser } from '@test/helpers.js'

const doRequest = async (token: string = '', query: Object = {}) =>
  request(app).get('/tickets/verifications').set('Cookie', `token=${token}`).query(query)

describe('GET /tickets/verifications', () => {
  it('lists ticket verifications verified by logged in user', async () => {
    const user = await createUser()
    const token = await authenticate(user)
    const otherUser = await createUser()
    const firstTicket = await createTicket()
    const secondTicket = await createTicket()
    const otherTicket = await createTicket()

    const firstVerification = await prismaClient.ticketVerification.create({
      data: {
        ticket: { connect: { id: firstTicket.id } },
        verified_by: { connect: { id: user.id } },
        document_number: '123456789',
        succeed: true
      }
    })
    const secondVerification = await prismaClient.ticketVerification.create({
      data: {
        ticket: { connect: { id: secondTicket.id } },
        verified_by: { connect: { id: user.id } },
        document_number: '000000000',
        succeed: false
      }
    })
    await prismaClient.ticketVerification.create({
      data: {
        ticket: { connect: { id: otherTicket.id } },
        verified_by: { connect: { id: otherUser.id } },
        document_number: '123456789',
        succeed: true
      }
    })

    const { status, body } = await doRequest(token)

    expect(status).toBe(200)
    expect(body).toMatchObject({
      page: 1,
      total_count: 2,
      total_pages: 1,
      items: [
        {
          id: secondVerification.id,
          verified_by_id: user.id,
          ticket_id: secondTicket.id,
          document_number: '000000000',
          succeed: false
        },
        {
          id: firstVerification.id,
          verified_by_id: user.id,
          ticket_id: firstTicket.id,
          document_number: '123456789',
          succeed: true
        }
      ]
    })
  })

  it('returns verifications from requested page', async () => {
    const user = await createUser()
    const token = await authenticate(user)
    const firstTicket = await createTicket()
    const secondTicket = await createTicket()
    const thirdTicket = await createTicket()

    const firstVerification = await prismaClient.ticketVerification.create({
      data: {
        ticket: { connect: { id: firstTicket.id } },
        verified_by: { connect: { id: user.id } },
        document_number: '111111111',
        succeed: true
      }
    })
    await prismaClient.ticketVerification.create({
      data: {
        ticket: { connect: { id: secondTicket.id } },
        verified_by: { connect: { id: user.id } },
        document_number: '222222222',
        succeed: true
      }
    })
    await prismaClient.ticketVerification.create({
      data: {
        ticket: { connect: { id: thirdTicket.id } },
        verified_by: { connect: { id: user.id } },
        document_number: '333333333',
        succeed: true
      }
    })

    const { status, body } = await doRequest(token, { page: 2, itemsPerPage: 2 })

    expect(status).toBe(200)
    expect(body).toMatchObject({
      page: 2,
      total_count: 3,
      total_pages: 2,
      items: [
        {
          id: firstVerification.id,
          verified_by_id: user.id,
          ticket_id: firstTicket.id,
          document_number: '111111111',
          succeed: true
        }
      ]
    })
  })

  it('fails without authentication', async () => {
    const { status, body } = await doRequest()

    expect(status).toBe(401)
    expect(body).toStrictEqual({ detail: 'Unauthenticated' })
  })
})
