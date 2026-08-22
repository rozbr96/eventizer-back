
import type { UserRetrieval } from './index.js'

type EventStatus = 'published' | 'canceled' | 'ongoing' | 'done'

interface BaseEvent<EventMetadata> {
  title: string
  description: string
  datetime: Date
  address: string
  address_title: string
  capacity: number
  price_in_cents: number
  metadata: EventMetadata
  status: EventStatus
}

export interface EventRetrieval<EventMetadata> extends BaseEvent<EventMetadata> {
  id: number
  organizer_id: number
  organizer: UserRetrieval
}

export interface EventCreation<EventMetadata> extends BaseEvent<EventMetadata> { }

export type Event<EventMetadata> = EventRetrieval<EventMetadata> | EventCreation<EventMetadata>
