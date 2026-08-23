
import type { PurchaseEdition, PurchaseRetrieval } from '@/core/entities/index.js'

export interface PurchaseCreationProps {
  event_id: number
  client_id: number
}

export default abstract class PurchaseRepository<EventMetadata> {
  abstract create(props: PurchaseCreationProps): Promise<PurchaseRetrieval<EventMetadata>>

  abstract update(
    purchaseId: number,
    data: PurchaseEdition
  ): Promise<PurchaseRetrieval<EventMetadata>>
}

