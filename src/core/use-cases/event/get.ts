
import type { EventRepository } from '@/core/repositories/index.js'

export class GetEventUseCase<EventMedatada> {
  constructor(private repository: EventRepository<EventMedatada>) { }

  execute(event_id: number) {
    return this.repository.get(event_id)
  }
}
