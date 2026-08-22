
import prismaClient from '@/prisma/client.js'

import type { PurchaseEdition, PurchaseRetrieval } from '@/core/entities/index.js'
import type { PurchaseCreationProps, PurchaseRepository } from '@/core/repositories/index.js'
import type { PurchaseUpdateInput } from '../generated/models.js'

export default class implements PurchaseRepository<any> {
  create(props: PurchaseCreationProps): Promise<PurchaseRetrieval<any>> {
    const { event_id, client_id } = props

    return prismaClient.purchase.create({
      data: {
        client: { connect: { id: client_id } },
        event: { connect: { id: event_id } }
      },
      include: { client: true, event: true }
    })
  }

  update(PurchaseId: number, data: PurchaseEdition<any>): Promise<PurchaseRetrieval<any>> {
    const eventData: PurchaseUpdateInput = {}

    if (data.holder) eventData.holder = data.holder
    if (data.status) eventData.status = data.status

    return prismaClient.purchase.update({
      where: { id: PurchaseId },
      data: eventData,
      include: { event: true, client: true }
    })
  }
}
