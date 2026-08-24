
import type { EventRepository, PurchaseRepository } from '@/core/repositories/index.js'

interface StartPurchaseUseCaseProps {
  client_id: number
  event_id: number
}

export class StartPurchaseUseCase<EventMetadata> {
  constructor(
    private purchaseRepository: PurchaseRepository<EventMetadata>,
    private eventRepository: EventRepository<EventMetadata>
  ) { }

  async execute(props: StartPurchaseUseCaseProps) {
    const [event, activePurchasesCount] = await Promise.all([
      this.eventRepository.get(props.event_id),
      this.purchaseRepository.countActiveByEvent(props.event_id)
    ])

    if (!event) throw { detail: 'Event Não Encontrado' }
    if (activePurchasesCount >= event.capacity) throw { detail: 'Sem Vagas' }

    return this.purchaseRepository.create(props)
  }
}
