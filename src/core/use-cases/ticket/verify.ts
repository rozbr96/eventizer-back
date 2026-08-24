
import type {
  TicketRepository,
  TicketVerificationRepository
} from '@/core/repositories/index.js'

export class VerifyTicketUseCase {
  constructor(
    private repository: TicketRepository,
    private ticketVerificationRepository: TicketVerificationRepository
  ) { }

  async execute(props: { code: string, document_number: string, verified_by_id: number }): Promise<void> {
    const ticket = await this.repository.findByCode(props.code)

    if (!ticket) throw { detail: 'Ticket not found' }

    const succeed = !ticket.consumed && ticket.document_number === props.document_number

    await this.ticketVerificationRepository.create({
      ticket_id: ticket.id,
      verified_by_id: props.verified_by_id,
      document_number: props.document_number,
      succeed
    })

    if (ticket.consumed) throw { detail: 'Ticket already used' }
    if (!succeed) throw { detail: 'Invalid Document' }

    await this.repository.update(ticket.code, { consumed: true })
  }
}
