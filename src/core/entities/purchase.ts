
import type { User, Event, EventRetrieval } from '@/core/entities/index.js'

type PurchaseStatus = 'eventConfirmation' | 'personalInfoSupplying' | 'payment' | 'done' | 'canceled' | 'expired'

export interface PurchaseRetrieval<EventMetadata> {
  id: number
  status: PurchaseStatus
  expires_at: Date
  client_id: number
  client: User
  event_id: number
  event: EventRetrieval<EventMetadata>
  holder: string
  document_number: string
}

export interface PurchaseCreation<EventMetadata> {
  client: User
  event: Event<EventMetadata>
}

export interface PurchaseEdition {
  holder?: string
  document_number?: string
  status?: PurchaseStatus
}
