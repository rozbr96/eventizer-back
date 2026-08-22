
import { describe, expect, it } from 'vitest'

import prismaClient from '@/prisma/client.js'
import { EventRepository } from '@/prisma/repositories/index.js'

describe('EventRepository', () => {
  const eventRepository = new EventRepository()

  it('creates an event', async () => {
    const { id: organizer_id } = await prismaClient.user.create({
      data: {
        email: 'user@email.com',
        name: 'User',
        password: 'pass',
      }
    })

    await eventRepository.create({
      organizer_id,
      event: {
        status: 'done',
        address: 'address',
        address_title: 'address_title',
        capacity: 10,
        datetime: new Date(2020, 10, 10, 13, 15),
        description: 'description',
        metadata: {},
        price_in_cents: 100_00,
        title: 'title'
      }
    })

    const event = await prismaClient.event.findFirst()

    expect(event?.id).not.toBeNull()
    expect(event).toMatchObject({ status: 'done', address: 'address', price_in_cents: 100_00 })
  })
})

