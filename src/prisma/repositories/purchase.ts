
import prismaClient from '@/prisma/client.js'

import type { PurchaseEdition, PurchaseRetrieval } from '@/core/entities/index.js'
import type { PurchaseCreationProps, PurchaseListingProps, PurchaseRepository } from '@/core/repositories/index.js'
import type { PurchaseUpdateInput } from '../generated/models.js'

export default class implements PurchaseRepository<any> {
  countActiveByEvent(eventId: number): Promise<number> {
    return prismaClient.purchase.count({
      where: {
        event_id: eventId,
        OR: [
          { status: 'done' },
          { expires_at: { gte: new Date() } }
        ]
      }
    })
  }

  countByClient(clientId: number): Promise<number> {
    return prismaClient.purchase.count({
      where: { client_id: clientId }
    })
  }

  create(props: PurchaseCreationProps): Promise<PurchaseRetrieval<any>> {
    const { event_id, client_id } = props

    return prismaClient.purchase.create({
      data: {
        client: { connect: { id: client_id } },
        event: { connect: { id: event_id } }
      },
      include: this.purchaseIncludes()
    })
  }

  get(id: number): Promise<PurchaseRetrieval<any>> {
    return new Promise(async (resolve, reject) => {
      const purchase = await prismaClient
        .purchase
        .findUnique({
          where: { id },
          include: this.purchaseIncludes()
        })

      purchase ? resolve(purchase) : reject()
    })
  }

  listByClient(clientId: number, props: PurchaseListingProps = {}): Promise<Array<PurchaseRetrieval<any>>> {
    const offset = props.offset || 0
    const perPage = props.perPage || 20

    return prismaClient.purchase.findMany({
      where: { client_id: clientId },
      include: this.purchaseIncludesWithTicket(),
      orderBy: { id: 'asc' },
      skip: offset,
      take: perPage
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
      include: this.purchaseIncludes()
    })
  }

  private purchaseIncludes() {
    return {
      client: true,
      event: this.eventIncludes()
    } as const
  }

  private purchaseIncludesWithTicket() {
    return {
      ...this.purchaseIncludes(),
      ticket: true
    } as const
  }

  private eventIncludes() {
    return {
      include: {
        organizer: true
      }
    } as const
  }
}
