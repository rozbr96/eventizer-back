
import { describe, expect, it } from 'vitest'

import prismaClient from '@/prisma/client.js'
import { EventRepository } from '@/prisma/repositories/index.js'
import { createEvents, createUser } from '@test/helpers.js'

describe('EventRepository', () => {
  const eventRepository = new EventRepository()

  it('creates an event', async () => {
    const { id: organizer_id } = await createUser()

    await eventRepository.create({
      organizer_id: organizer_id as number,
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

  it('lists existing events', async () => {
    const events = await eventRepository.list()

    expect(events.length).toBe(0)
  })

  it('lists existing events', async () => {
    const { id: organizer_id } = await createUser()

    await createEvents({ organizer_id, count: 3 })

    const events = await eventRepository.list()

    expect(events.length).toBe(3)
  })
})

