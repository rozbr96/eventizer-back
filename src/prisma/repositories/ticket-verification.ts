
import prismaClient from '@/prisma/client.js'

import type { TicketVerificationCreation, TicketVerificationRetrieval } from '@/core/entities/index.js'
import type {
  TicketVerificationListingProps,
  TicketVerificationRepository
} from '@/core/repositories/index.js'

export default class implements TicketVerificationRepository<any> {
  create(props: TicketVerificationCreation): Promise<TicketVerificationRetrieval<any>> {
    return prismaClient.ticketVerification.create({
      data: {
        succeed: props.succeed,
        document_number: props.document_number,
        ticket: { connect: { id: props.ticket_id } },
        verified_by: { connect: { id: props.verified_by_id } }
      },
      include: this.commonIncludes()
    })
  }

  countByVerifiedBy(verifiedById: number): Promise<number> {
    return prismaClient.ticketVerification.count({
      where: { verified_by_id: verifiedById }
    })
  }

  listByVerifiedBy(
    verifiedById: number,
    props: TicketVerificationListingProps = {}
  ): Promise<Array<TicketVerificationRetrieval<any>>> {
    const offset = props.offset || 0
    const perPage = props.perPage || 20

    return prismaClient.ticketVerification.findMany({
      where: { verified_by_id: verifiedById },
      include: this.commonIncludes(),
      orderBy: [{ when: 'desc' }, { id: 'desc' }],
      skip: offset,
      take: perPage
    })
  }

  private commonIncludes() {
    return {
      verified_by: true,
      ticket: {
        include: {
          purchase: {
            include: {
              event: { include: { organizer: true } },
              client: true
            }
          },
          event: { include: { organizer: true } }
        }
      }
    } as const
  }
}
