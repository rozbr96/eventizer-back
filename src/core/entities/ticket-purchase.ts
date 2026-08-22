
import type { User, Event } from '@/core/entities/index.js'

type TicketPurchaseStatus = 'eventConfirmation' | 'personalInfoSupplying' | 'payment' | 'done' | 'canceled' | 'expired'

interface BaseTicketPurchase<EventMetadata> {
  client: User
  event: Event<EventMetadata>
}

export interface TicketPurchaseRetrieval<EventMetadata> extends BaseTicketPurchase<EventMetadata> {
  id: number
  status: TicketPurchaseStatus
  expires_at: Date
}

export interface TicketPurchaseCreation<EventMetadata> extends BaseTicketPurchase<EventMetadata> {
  client: User
}

export interface TicketPurchaseEdition<EventMetadata> extends BaseTicketPurchase<EventMetadata> {
  holder?: string
  status?: TicketPurchaseStatus
}
