
import type { PurchaseRepository } from '@/core/repositories/index.js'

interface PurchaseProps {
  id: number
}

interface AdvancePurchaseToPersonalInfoSupplyingStep extends PurchaseProps {
  status: 'personalInfoSupplying'
}

type AdvancePurchaseStepProps = AdvancePurchaseToPersonalInfoSupplyingStep

export class AdvancePurchaseStep<EventMetadata> {
  constructor(private repository: PurchaseRepository<EventMetadata>) { }

  execute(props: AdvancePurchaseStepProps) {
    const { id, status } = props

    return this.repository.update(id, { status })
  }
}

