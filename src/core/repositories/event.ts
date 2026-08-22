
import type {
  EventCreation,
  EventRetrieval
} from '@/core/entities/index.js'

interface EventCreationProps<EventMetadata> {
  event: EventCreation<EventMetadata>
  organizer_id: number | string
}

export interface EventListingProps {
  offset?: number
  perPage?: number
}

export default abstract class EventRepository<EventMetadata> {
  abstract count(): Promise<number>
  abstract create(props: EventCreationProps<EventMetadata>): Promise<EventRetrieval<EventMetadata>>
  abstract list(props: EventListingProps): Promise<Array<EventRetrieval<EventMetadata>>>
}

