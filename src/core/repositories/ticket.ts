
import type { TicketRetrieval } from '@/core/entities/index.js'

interface TicketCreationProps {
  purchase_id: number
  event_id: number
  holder: string
}
export default abstract class TicketRepository<EventMetadata> {
  abstract create(props: TicketCreationProps): Promise<TicketRetrieval<EventMetadata>>
}

