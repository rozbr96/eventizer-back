
import type { TicketPurchaseEdition, TicketPurchaseRetrieval } from '@/core/entities/index.js'

export interface TicketPurchaseCreationProps {
  event_id: number
  client_id: number
}

export default abstract class TicketPurchaseRepository<EventMetadata> {
  abstract create(props: TicketPurchaseCreationProps): Promise<TicketPurchaseRetrieval<EventMetadata>>

  abstract update(
    ticketPurchaseId: number,
    data: TicketPurchaseEdition<EventMetadata>
  ): Promise<TicketPurchaseRetrieval<EventMetadata>>
}

