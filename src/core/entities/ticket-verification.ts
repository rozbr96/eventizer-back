
import type { TicketRetrieval, UserRetrieval } from '@/core/entities/index.js'

export interface TicketVerificationCreation {
  ticket_id: number
  succeed: boolean
  verified_by_id: number
  document_number: string
}

export interface TicketVerificationRetrieval<EventMetadata> extends TicketVerificationCreation {
  id: number
  ticket: TicketRetrieval<EventMetadata>
  when: Date
  verified_by: UserRetrieval
}
