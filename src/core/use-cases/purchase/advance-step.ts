
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
  document_number: string
}

interface AdvancePurchaseToPaymentDoneStep extends PurchaseProps {
  status: 'done'
}

type AdvancePurchaseStepProps =
  AdvancePurchaseToPersonalInfoSupplyingStep
  | AdvancePurchaseToPaymentStep
  | AdvancePurchaseToPaymentDoneStep

const previousStatus = {
  personalInfoSupplying: 'eventConfirmation',
  payment: 'personalInfoSupplying',
  done: 'payment'
}

export class AdvancePurchaseStep<EventMetadata> {
  constructor(
    private purchaseRepository: PurchaseRepository<EventMetadata>,
    private ticketRepository: TicketRepository<EventMetadata>
  ) { }

  async execute(props: AdvancePurchaseStepProps) {
    const currentPurchase = await this.purchaseRepository.get(props.id)

    if (currentPurchase.status != previousStatus[props.status])
      throw { status: 403, detail: 'Wrong step' }

    const purchase = await this.purchaseRepository.update(props.id, props)

    if (props.status != 'done') return purchase

    return await new CreateTicketUseCase(this.ticketRepository)
      .execute({
        event_id: purchase.event.id,
        purchase_id: purchase.id,
        holder: purchase.holder || '',
        document_number: purchase.document_number || ''
      })
  }
}
