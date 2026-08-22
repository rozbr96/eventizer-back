
import type { EventCreation, EventRetrieval } from '@/core/entities/index.js'
import type { EventRepository } from '@/core/repositories/index.js'

export class CreateEventUseCase<EventMetadata> {
  constructor(private repository: EventRepository<EventMetadata>) { }

  execute(event: EventCreation<EventMetadata>, organizer_id: any): Promise<EventRetrieval<EventMetadata>> {
    return this.repository.create({ event, organizer_id })
  }
}

