
import { describe, expect, it } from 'vitest'
import request from 'supertest'

import app from '@/app.js'
import prismaClient from '@/prisma/client.js'

import { authenticate, createUser } from '@test/helpers.js'

const doRequest = async (token: string, data: any) => {
  return await request(app)
    .post('/events')
    .set('Authorization', `Bearer ${token}`)
    .send(data)
}

describe('POST /events', () => {
  it('creates an event', async () => {
    const user = await createUser()
    const token = await authenticate(user)

    const { status } = await doRequest(token, {
      organizer_id: user.id,
      event: {
        title: "Next Year's XMas",
        description: 'Watch movies at Christmas',
        datetime: new Date(new Date().getFullYear() + 1, 11, 24),
        address: 'Street Name, number, Neighbourhood',
        address_title: "John's Home",
        capacity: 30,
        price_in_cents: 100_00,
        metadata: {
          "adult": false,
          "backdrop_path": null,
          "genre_ids": [35, 10751],
          "id": 1434499,
          "title": "Christmas in Paradise",
          "original_language": "en",
          "original_title": "Christmas in Paradise",
          "overview": "A beloved small-town doctor finds himself with a unique bounty on his head just a week before Christmas, in a town where everything is not as it seems.",
          "popularity": 0.4609,
          "poster_path": null,
          "release_date": "",
          "softcore": false,
          "video": false,
          "vote_average": 0,
          "vote_count": 0
        }
      }
    })

    expect(status).toBe(201)

    const [createdEvent] = await prismaClient.event.findMany()

    expect(createdEvent).toMatchObject({ title: "Next Year's XMas" })
  })

  it('fails due to missing authentication', async () => {
    const { status } = await doRequest('', {})

    expect(status).toBe(401)
  })

  it('fails due to missing data', async () => {
    const user = await createUser()
    const token = await authenticate(user)

    const { status, body } = await doRequest(token, {})

    expect(status).toBe(400)
    expect(body).toStrictEqual({
      details: [
        '[organizer_id] Invalid input',
        '[event] Invalid input: expected object, received undefined'
      ]
    })
  })

  it('fails due to missing event data', async () => {
    const user = await createUser()
    const token = await authenticate(user)

    const { status, body } = await doRequest(token, {
      organizer_id: true,
      event: {}
    })

    expect(status).toBe(400)
    expect(body).toStrictEqual({
      details: [
        '[organizer_id] Invalid input',
        '[event.title] Invalid input: expected string, received undefined',
        '[event.description] Invalid input: expected string, received undefined',
        '[event.datetime] Invalid input: expected string, received undefined',
        '[event.address] Invalid input: expected string, received undefined',
        '[event.address_title] Invalid input: expected string, received undefined',
        '[event.capacity] Invalid input: expected number, received undefined',
        '[event.price_in_cents] Invalid input: expected number, received undefined',
        '[event.metadata] Invalid input: expected nonoptional, received undefined'
      ]
    })
  })

  it('fails due to invalid data', async () => {
    const user = await createUser()
    const token = await authenticate(user)

    const { status, body } = await doRequest(token, {
      organizer_id: user.id,
      event: {
        price_in_cents: -100,
        datetime: 'invalid datetime',
        capacity: -1
      }
    })

    expect(status).toBe(400);

    [
      '[event.price_in_cents] Must be positive',
      '[event.datetime] Invalid ISO datetime',
      '[event.capacity] Must be positive'
    ].forEach((error) => { expect(body.details).toContain(error) })
  })
})
