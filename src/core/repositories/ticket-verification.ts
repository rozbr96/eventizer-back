
import type { TicketVerificationCreation, TicketVerificationRetrieval } from '@/core/entities/index.js'

export interface TicketVerificationListingProps {
  offset?: number
  perPage?: number
}

export default abstract class TicketVerificationRepository<EventMetadata = any> {
  abstract create(props: TicketVerificationCreation): Promise<TicketVerificationRetrieval<EventMetadata>>
  abstract countByVerifiedBy(verifiedById: number): Promise<number>
  abstract listByVerifiedBy(
    verifiedById: number,
    props?: TicketVerificationListingProps
  ): Promise<Array<TicketVerificationRetrieval<EventMetadata>>>
}
