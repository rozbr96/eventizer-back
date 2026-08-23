
import type { User, Event } from '@/core/entities/index.js'

type PurchaseStatus = 'eventConfirmation' | 'personalInfoSupplying' | 'payment' | 'done' | 'canceled' | 'expired'

export interface PurchaseRetrieval<EventMetadata> {
  id: number
  status: PurchaseStatus
  expires_at: Date
  client: User
  event: Event<EventMetadata>
}

export interface PurchaseCreation<EventMetadata> {
  client: User
  event: Event<EventMetadata>
}

export interface PurchaseEdition {
  holder?: string
  status?: PurchaseStatus
}
