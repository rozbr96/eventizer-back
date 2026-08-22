
import prismaClient from '@/prisma/client.js'

import type { TicketPurchaseEdition, TicketPurchaseRetrieval } from '@/core/entities/index.js'
import type { TicketPurchaseCreationProps, TicketPurchaseRepository } from '@/core/repositories/index.js'
import type { TicketPurchaseUpdateInput } from '../generated/models.js'

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

  update(ticketPurchaseId: number, data: TicketPurchaseEdition<any>): Promise<TicketPurchaseRetrieval<any>> {
    const eventData: TicketPurchaseUpdateInput = {}

    if (data.holder) eventData.holder = data.holder
    if (data.status) eventData.status = data.status

    return prismaClient.ticketPurchase.update({
      where: { id: ticketPurchaseId },
      data: eventData,
      include: { event: true, client: true }
    })
  }
}
