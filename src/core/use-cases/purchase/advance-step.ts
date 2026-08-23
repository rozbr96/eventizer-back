
import type { PurchaseRepository } from '@/core/repositories/index.js'

interface PurchaseProps {
  id: number
}

interface AdvancePurchaseToPersonalInfoSupplyingStep extends PurchaseProps {
  status: 'personalInfoSupplying'
}

interface AdvancePurchaseToPaymentStep extends PurchaseProps {
  status: 'payment'
  holder: string
}

type AdvancePurchaseStepProps = AdvancePurchaseToPersonalInfoSupplyingStep | AdvancePurchaseToPaymentStep

export class AdvancePurchaseStep<EventMetadata> {
  constructor(private repository: PurchaseRepository<EventMetadata>) { }

  execute(props: AdvancePurchaseStepProps) {
    return this.repository.update(props.id, props)
  }
}

