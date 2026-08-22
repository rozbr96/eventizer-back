
import prismaClient from '@/prisma/client.js'

import type { TicketPurchaseRetrieval } from '@/core/entities/index.js'
import type { TicketPurchaseCreationProps, TicketPurchaseRepository } from '@/core/repositories/index.js'

export default class implements TicketPurchaseRepository<any> {
  create(props: TicketPurchaseCreationProps): Promise<TicketPurchaseRetrieval<any>> {
    const { event_id, client_id } = props

    return prismaClient.ticketPurchase.create({
      data: {
        client: { connect: { id: client_id } },
        event: { connect: { id: event_id } }
      },
      include: { client: true, event: true }
    })
  }
}
