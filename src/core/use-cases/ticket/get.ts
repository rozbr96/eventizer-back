
import type { TicketRepository } from '@/core/repositories/index.js'

export class GetTicketUseCase<EventMetadata> {
  constructor(private repository: TicketRepository<EventMetadata>) { }

  execute(id: number) {
    return this.repository.get(id)
  }
}
