
import type { EventRepository } from '@/core/repositories/index.js'

interface ListEventsUseCaseProps {
  page?: number
  itemsPerPage?: number
}

export class ListEventsUseCase<EventMetadata> {
  constructor(private repository: EventRepository<EventMetadata>) { }

  async execute(props: ListEventsUseCaseProps = {}) {
    const page = props.page || 1
    const perPage = props.itemsPerPage || 20

    const promises = [
      this.repository.count(),
      this.repository.list({ offset: perPage * (page - 1), perPage })
    ]

    let [total_count, items] = await Promise.all(promises)

    const total_pages = typeof total_count === 'number' ? Math.ceil(total_count / perPage) : 0

    return { page, items, total_count, total_pages }
  }
}

