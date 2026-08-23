
import type {
  EventCreation,
  EventRetrieval
} from '@/core/entities/index.js'

interface EventCreationProps<EventMetadata> {
  event: EventCreation<EventMetadata>
  organizer_id: number
}

export interface EventListingProps {
  offset?: number
  perPage?: number
}

export default abstract class EventRepository<EventMetadata> {
  abstract count(): Promise<number>
  abstract create(props: EventCreationProps<EventMetadata>): Promise<EventRetrieval<EventMetadata>>
  abstract get(event_id: number): Promise<EventRetrieval<EventMetadata> | null>
  abstract list(props: EventListingProps): Promise<Array<EventRetrieval<EventMetadata>>>
}

