
import prismaClient from '@/prisma/client.js'

import type { EventCreation, EventRetrieval } from '@/core/entities/index.js'
import type { EventRepository } from '@/core/repositories/index.js'
import type { EventCreateInput } from '@/prisma/generated/models.js'

interface EventCreationsProps {
  event: EventCreation<any>,
  organizer_id: number
}

export default class implements EventRepository<any> {
  create(props: EventCreationsProps): Promise<EventRetrieval<any>> {
    const { event, organizer_id } = props

    const data: EventCreateInput = {
      ...event,
      organizer: { connect: { id: organizer_id } }
    }

    return prismaClient.event.create({ data, include: { organizer: true } })
  }

  list(): Promise<EventRetrieval<any>[]> {
    return prismaClient.event.findMany({ include: { organizer: true } })
  }
}

