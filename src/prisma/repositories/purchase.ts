
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
      include: { client: true, event: { include: { organizer: true } } }
    })
  }

  get(id: number): Promise<PurchaseRetrieval<any>> {
    return new Promise(async (resolve, reject) => {
      const purchase = await prismaClient
        .purchase
        .findUnique({
          where: { id },
          include: { client: true, event: { include: { organizer: true } } }
        })

      purchase ? resolve(purchase) : reject()
    })
  }

  update(purchaseId: number, data: PurchaseEdition): Promise<PurchaseRetrieval<any>> {
    const eventData: PurchaseUpdateInput = {}

    if (data.holder) eventData.holder = data.holder
    if (data.document_number !== undefined) eventData.document_number = data.document_number
    if (data.status) eventData.status = data.status

    return prismaClient.purchase.update({
      where: { id: purchaseId },
      data: eventData,
      include: { client: true, event: { include: { organizer: true } } }
    })
  }
}
