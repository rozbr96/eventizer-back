import type { PurchaseRepository } from '@/core/repositories/index.js'

export class GetPurchaseUseCase<EventMetadata> {
  constructor(private repository: PurchaseRepository<EventMetadata>) { }

  execute(purchaseId: number) {
    return this.repository.get(purchaseId)
  }
}
