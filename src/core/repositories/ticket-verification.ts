
import type { TicketVerificationCreation, TicketVerificationRetrieval } from '@/core/entities/index.js'

export default abstract class TicketVerificationRepository<EventMetadata = any> {
  abstract create(props: TicketVerificationCreation): Promise<TicketVerificationRetrieval<EventMetadata>>
}
