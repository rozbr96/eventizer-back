
import type { Event } from '@/core/entities/event.js'
import type { PaginatedSearchResult } from '@/core/entities/search-result.js'
import type { EventRepository } from '@/core/repositories/index.js'

interface ListEventsUseCaseProps {
  page?: number
  itemsPerPage?: number
}

export class ListEventsUseCase<EventMetadata> {
  constructor(private repository: EventRepository<EventMetadata>) { }

  async execute(props: ListEventsUseCaseProps = {}): Promise<PaginatedSearchResult<Event<EventMetadata>>> {
    const page = props.page || 1
    const perPage = props.itemsPerPage || 20

    const [total_count, items] = await Promise.all([
      this.repository.count(),
      this.repository.list({ offset: perPage * (page - 1), perPage })
    ])

    const total_pages = typeof total_count === 'number' ? Math.ceil(total_count / perPage) : 0

    return {
      page,
      total_pages,
      items,
      total_count,
    }
  }
}

