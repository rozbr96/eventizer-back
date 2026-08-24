import type { PaginatedSearchResult, TicketVerificationRetrieval } from '@/core/entities/index.js'
import type { TicketVerificationRepository } from '@/core/repositories/index.js'

interface ListTicketVerificationsUseCaseProps {
  verifiedById: number
  page?: number
  itemsPerPage?: number
}

export class ListTicketVerificationsUseCase<EventMetadata> {
  constructor(private repository: TicketVerificationRepository<EventMetadata>) { }

  async execute(
    props: ListTicketVerificationsUseCaseProps
  ): Promise<PaginatedSearchResult<TicketVerificationRetrieval<EventMetadata>>> {
    const page = props.page || 1
    const perPage = props.itemsPerPage || 20

    const [total_count, items] = await Promise.all([
      this.repository.countByVerifiedBy(props.verifiedById),
      this.repository.listByVerifiedBy(props.verifiedById, {
        offset: perPage * (page - 1),
        perPage
      })
    ])

    const total_pages = typeof total_count === 'number' ? Math.ceil(total_count / perPage) : 0

    return {
      page,
      total_pages,
      total_count,
      items
    }
  }
}
