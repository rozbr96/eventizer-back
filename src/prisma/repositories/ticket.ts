
import * as crypto from 'crypto'

import prismaClient from '@/prisma/client.js'

import type { TicketEdition, TicketRetrieval } from '@/core/entities/index.js';
import type { TicketRepository } from '@/core/repositories/index.js'
import type { TicketCreateInput } from '../generated/models.js';

interface CreateTicketUseCaseProps {
  purchase_id: number
  event_id: number
  holder: string
}

export default class implements TicketRepository<any> {
  create(props: CreateTicketUseCaseProps): Promise<TicketRetrieval<any>> {
    const ticketData: TicketCreateInput = {
      code: crypto.randomUUID(),
      holder: props.holder,
      purchase: { connect: { id: props.purchase_id } },
      event: { connect: { id: props.event_id } }
    }

    return prismaClient.ticket.create({
      data: ticketData,
      include: this.commonIncludes()
    })
  }

  findByCode(code: string): Promise<TicketRetrieval<any> | null> {
    return prismaClient.ticket.findFirst({
      where: { code },
      include: this.commonIncludes()
    })
  }

  update(code: string, props: TicketEdition): Promise<TicketRetrieval<any>> {
    return prismaClient.ticket.update({
      where: { code },
      data: props,
      include: this.commonIncludes()
    })
  }

  private commonIncludes() {
    return {
      purchase: {
        include: {
          event: {
            include: {
              organizer: true
            }
          },
          client: true
        }
      },
      event: {
        include: {
          organizer: true
        }
      }
    }
  }
}
