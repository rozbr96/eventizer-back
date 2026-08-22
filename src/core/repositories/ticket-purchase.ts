
import type { TicketPurchaseCreation, TicketPurchaseRetrieval } from '@/core/entities/index.js'

export interface TicketPurchaseCreationProps<EventMetadata> {
  data: TicketPurchaseCreation<EventMetadata>
  client_id: number
}

export default abstract class TicketPurchaseRepository<EventMetadata> {
  abstract create(props: TicketPurchaseCreationProps<EventMetadata>): Promise<TicketPurchaseRetrieval<EventMetadata>>
}

