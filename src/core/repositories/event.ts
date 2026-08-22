
import type {
  EventCreation,
  EventRetrieval
} from '@/core/entities/index.js'

export default abstract class EventRepository<EventMetadata> {
  abstract create(props: { event: EventCreation<EventMetadata>, organizer_id: number | string }): Promise<EventRetrieval<EventMetadata>>
  abstract list(): Promise<Array<EventRetrieval<EventMetadata>>>
}

