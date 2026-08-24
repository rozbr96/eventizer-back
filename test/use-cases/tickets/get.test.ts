
import { describe, expect, it } from 'vitest'

import { GetTicketUseCase } from '@/core/use-cases/index.js'
import { TicketRepository } from '@/prisma/repositories/index.js'
import { createTicket } from '@test/helpers.js'

describe('GetTicketUseCase', () => {
  it('gets ticket by id', async () => {
    const ticketRepository = new TicketRepository()
    const getTicketUseCase = new GetTicketUseCase(ticketRepository)
    const ticket = await createTicket({ holder: 'Holder' })

    const result = await getTicketUseCase.execute(ticket.id)

    expect(result).toMatchObject({
      id: ticket.id,
      code: ticket.code,
      holder: 'Holder'
    })
  })
})
