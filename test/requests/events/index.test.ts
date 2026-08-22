
import { describe, expect, it } from 'vitest'
import request from 'supertest'

import app from '@/app.js'
import prismaClient from '@/prisma/client.js'

describe('POST /events', () => {
  it('creates an event', async () => {
    const { id: organizer_id } = await prismaClient.user.create({
      data: {
        name: 'User', email: 'user@email.com',
        password: 'pass', active: true,
        role: 'organizer'
      }
    })

    const { status, body } = await request(app).post('/events').send({
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
  })
})
