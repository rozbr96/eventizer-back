
import type { PurchaseRepository } from '@/core/repositories/index.js'

interface StartPurchaseUseCaseProps {
  client_id: number
  event_id: number
}

export class StartPurchaseUseCase<EventMetadata> {
  constructor(private repository: PurchaseRepository<EventMetadata>) { }

  execute(props: StartPurchaseUseCaseProps) {
    return this.repository.create(props)
  }
}
