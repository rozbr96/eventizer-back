
import prismaClient from '@/prisma/client.js'

import type { TicketVerificationCreation, TicketVerificationRetrieval } from '@/core/entities/index.js'
import type { TicketVerificationRepository } from '@/core/repositories/index.js'

export default class implements TicketVerificationRepository<any> {
  create(props: TicketVerificationCreation): Promise<TicketVerificationRetrieval<any>> {
    return prismaClient.ticketVerification.create({
      data: {
        succeed: props.succeed,
        document_number: props.document_number,
        ticket: { connect: { id: props.ticket_id } },
        verified_by: { connect: { id: props.verified_by_id } }
      },
      include: {
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
      }
    })
  }
}
