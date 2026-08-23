
import type {
  EventRetrieval,
  PurchaseRetrieval
} from '@/core/entities/index.js'

export interface TicketCreation {
  holder: string
  purchase_id: number
  event_id: number
}

export interface TicketRetrieval<EventMetadata> extends TicketCreation {
  id: number
  code: string
  consumed: boolean
  purchase: PurchaseRetrieval<EventMetadata>
  event: EventRetrieval<EventMetadata>
}

export interface TicketEdition {
  consumed?: boolean
}

