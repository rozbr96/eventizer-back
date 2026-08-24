
import type { TicketEdition, TicketRetrieval } from '@/core/entities/index.js'

interface TicketCreationProps {
  purchase_id: number
  event_id: number
  holder: string
}
export default abstract class TicketRepository<EventMetadata = any> {
  abstract create(props: TicketCreationProps): Promise<TicketRetrieval<EventMetadata>>
  abstract get(id: number): Promise<TicketRetrieval<EventMetadata> | null>
  abstract update(code: string, props: TicketEdition): Promise<TicketRetrieval<EventMetadata>>
  abstract findByCode(code: string): Promise<TicketRetrieval<EventMetadata> | null>
}
