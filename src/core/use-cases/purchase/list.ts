import type { PurchaseRetrieval } from '@/core/entities/index.js'
import type { PaginatedSearchResult } from '@/core/entities/search-result.js'
import type { PurchaseRepository } from '@/core/repositories/index.js'

interface ListPurchasesUseCaseProps {
  clientId: number
  page?: number
  itemsPerPage?: number
}

export class ListPurchasesUseCase<EventMetadata> {
  constructor(private repository: PurchaseRepository<EventMetadata>) { }

  async execute(props: ListPurchasesUseCaseProps): Promise<PaginatedSearchResult<PurchaseRetrieval<EventMetadata>>> {
    const page = props.page || 1
    const perPage = props.itemsPerPage || 20

    const [total_count, items] = await Promise.all([
      this.repository.countByClient(props.clientId),
      this.repository.listByClient(props.clientId, { offset: perPage * (page - 1), perPage })
    ])

    const total_pages = typeof total_count === 'number' ? Math.ceil(total_count / perPage) : 0

    return {
      page,
      total_pages,
      items,
      total_count
    }
  }
}
