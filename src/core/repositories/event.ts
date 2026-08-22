
import type {
  EventCreation,
  EventRetrieval
} from '@/core/entities/index.js'

export default abstract class EventRepository {
  abstract create(props: { event: EventCreation, organizer_id: number | string }): Promise<EventRetrieval>
}

