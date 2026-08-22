
import type { User, Event } from '@/core/entities/index.js'

type PurchaseStatus = 'eventConfirmation' | 'personalInfoSupplying' | 'payment' | 'done' | 'canceled' | 'expired'

interface BasePurchase<EventMetadata> {
  client: User
  event: Event<EventMetadata>
}

export interface PurchaseRetrieval<EventMetadata> extends BasePurchase<EventMetadata> {
  id: number
  status: PurchaseStatus
  expires_at: Date
}

export interface PurchaseCreation<EventMetadata> extends BasePurchase<EventMetadata> {
  client: User
}

export interface PurchaseEdition<EventMetadata> extends BasePurchase<EventMetadata> {
  holder?: string
  status?: PurchaseStatus
}
