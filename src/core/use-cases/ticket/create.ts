
import type { TicketCreation } from '@/core/entities/ticket.js'
import type { TicketRepository } from '@/core/repositories/index.ts'

export class CreateTicketUseCase<EventMetadata> {
  constructor(private repository: TicketRepository<EventMetadata>) { }

  execute(props: TicketCreation) {
    return this.repository.create(props)
  }
}
