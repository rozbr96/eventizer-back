
import type { TicketRepository } from '@/core/repositories/index.js';

export class VerifyTicketUseCase {
  constructor(private repository: TicketRepository) { }

  execute(props: { code: string }) {
    return new Promise<void>(async (resolve, reject) => {
      const ticket = await this.repository.findByCode(props.code)

      if (!ticket) return reject({ detail: 'Ticket not found' })
      if (ticket.consumed) return reject({ detail: 'Ticket already used' })

      await this.repository.update(ticket.code, { consumed: true })

      resolve()
    })
  }
}
