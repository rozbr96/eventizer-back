
import type {
  PurchaseRepository,
  TicketRepository
} from '@/core/repositories/index.js'
import { CreateTicketUseCase } from '../ticket/create.js'

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

interface AdvancePurchaseToPaymentDoneStep extends PurchaseProps {
  status: 'done'
}

type AdvancePurchaseStepProps =
  AdvancePurchaseToPersonalInfoSupplyingStep
  | AdvancePurchaseToPaymentStep
  | AdvancePurchaseToPaymentDoneStep

export class AdvancePurchaseStep<EventMetadata> {
  constructor(
    private purchaseRepository: PurchaseRepository<EventMetadata>,
    private ticketRepository: TicketRepository<EventMetadata>
  ) { }

  async execute(props: AdvancePurchaseStepProps) {
    const purchase = await this.purchaseRepository.update(props.id, props)

    if (props.status != 'done') return purchase

    return await new CreateTicketUseCase(this.ticketRepository)
      .execute({ event_id: purchase.event.id, purchase_id: purchase.id, holder: purchase.holder || '' })
  }
}

