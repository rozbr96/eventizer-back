
import prismaClient from '@/prisma/client.js'

import type { EventCreation, EventRetrieval } from '@/core/entities/index.js'
import type { EventRepository } from '@/core/repositories/index.js'
import type { EventCreateInput } from '@/prisma/generated/models.js'

interface EventCreationsProps {
  event: EventCreation,
  organizer_id: number
}

export default class implements EventRepository {
  create(props: EventCreationsProps): Promise<EventRetrieval> {
    const { event, organizer_id } = props

    const data: EventCreateInput = {
      ...event,
      organizer: { connect: { id: organizer_id } }
    }

    return prismaClient.event.create({ data, include: { organizer: true } })
  }
}

