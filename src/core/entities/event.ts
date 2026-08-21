
import type { UserRetrieval } from './index.js'

type EventStatus = 'published' | 'canceled' | 'ongoing' | 'done'

interface BaseEvent {
  title: string
  description: string
  datetime: Date
  address: string
  address_title: string
  capacity: number
  price_in_cents: number
  metadata: any
  status: EventStatus
}

export interface EventRetrieval extends BaseEvent {
  organizer_id: number | string
  organizer: UserRetrieval
}

export interface EventCreation extends BaseEvent { }

