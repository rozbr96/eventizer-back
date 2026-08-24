
import type { PurchaseEdition, PurchaseRetrieval } from '@/core/entities/index.js'

export interface PurchaseCreationProps {
  event_id: number
  client_id: number
}

export interface PurchaseListingProps {
  offset?: number
  perPage?: number
}

export default abstract class PurchaseRepository<EventMetadata> {
  abstract countActiveByEvent(eventId: number): Promise<number>

  abstract countByClient(clientId: number): Promise<number>

  abstract create(props: PurchaseCreationProps): Promise<PurchaseRetrieval<EventMetadata>>

  abstract get(purchaseId: number): Promise<PurchaseRetrieval<EventMetadata>>

  abstract listByClient(
    clientId: number,
    props?: PurchaseListingProps
  ): Promise<Array<PurchaseRetrieval<EventMetadata>>>

  abstract update(
    purchaseId: number,
    data: PurchaseEdition
  ): Promise<PurchaseRetrieval<EventMetadata>>
}
