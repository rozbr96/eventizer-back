
import { faker } from '@faker-js/faker'

import prismaClient from '@/prisma/client.js'

import { EventRepository, UserRepository } from '@/prisma/repositories/index.js'
import { UserTokenRepository } from '@/redis/repositories/index.js'

import {
  CreateUserUseCase,
  CreateUserTokenUseCase,
  CreateEventUseCase
} from '@/core/use-cases/index.js'

import type {
  EventCreation,
  EventRetrieval,
  PurchaseCreation,
  PurchaseRetrieval,
  UserCreation,
  UserRetrieval,
  UserTokenData
} from '@/core/entities/index.js'

import type { Movie } from '@/lib/tmdb/entities.js'
import type { PurchaseStatus } from '@/prisma/generated/enums.js'

export const authenticate = async (user: UserTokenData) => {
  const userTokenRepository = new UserTokenRepository()

  return await new CreateUserTokenUseCase(userTokenRepository).execute(user)
}

export const createUser = async (data: Partial<UserCreation> = {}): Promise<UserRetrieval> => {
  const userData: UserCreation = Object.assign({
    email: faker.internet.email(),
    active: true,
    name: faker.person.fullName(),
    password: faker.internet.password(),
    role: 'client'
  }, data)

  const userRepository = new UserRepository()

  return await new CreateUserUseCase(userRepository).execute(userData)
}

export const createEventMetadata = (data: Partial<Movie> = {}): Movie => {
  const title = faker.book.title()

  return Object.assign({
    adult: false,
    backdrop_path: faker.string.alpha(),
    genre_ids: [],
    id: faker.number.int({ max: 100_000 }),
    title,
    original_language: faker.location.language().alpha2,
    original_title: title,
    overview: faker.lorem.paragraph(),
    popularity: faker.number.float({ max: 10 }),
    poster_path: faker.string.alpha(),
    release_date: faker.date.past(),
    softcore: false,
    video: false,
    vote_average: faker.number.float({ max: 10 }),
    vote_count: faker.number.int({ max: 1000 })
  }, data)
}

export const createEvent = async (
  props: {
    data?: Partial<EventCreation<Object>>,
    organizer_id?: number,
  } = {}
): Promise<EventRetrieval<Object>> => {
  const eventRepository = new EventRepository()

  const data = props.data || {}
  const organizer_id = props.organizer_id || (await createUser()).id

  const eventData: EventCreation<Object> = {
    address: faker.location.streetAddress(),
    address_title: faker.location.secondaryAddress(),
    capacity: faker.number.int({ min: 1, max: 50 }),
    datetime: faker.date.future(),
    description: faker.lorem.paragraph(),
    metadata: createEventMetadata(),
    title: faker.lorem.slug(),
    price_in_cents: faker.number.int({ max: 100_000_00 }),
    status: 'published',
    ...data
  }

  return new CreateEventUseCase(eventRepository).execute(eventData, organizer_id)
}

export const createEvents = async (
  props: {
    data?: Partial<EventCreation<Object>>,
    organizer_id?: number,
    count?: number
  }
): Promise<Array<EventRetrieval<Object>>> => {
  const promises = []

  const data = props.data || {}
  const count = props.count || 1
  const organizer_id = props.organizer_id || (await createUser()).id

  for (let index = 0; index < count; index++)
    promises.push(createEvent({ organizer_id, data }))

  return Promise.all(promises)
}

export const createPurchase = async (
  props: Partial<{
    client_id: number
    event_id: number
    status: PurchaseStatus
    holder: string
    expires_at: Date
  }> = {}
): Promise<PurchaseRetrieval<any>> => {
  const client_id = props.client_id || (await createUser({ role: 'client' })).id
  const event_id = props.event_id || (await createEvent()).id
  const status = props.status || 'payment'
  const holder = props.holder || ''
  const expires_at = props.expires_at || new Date(Date.now() + 60 * 15 * 1000)

  return prismaClient.purchase.create({
    data: {
      status,
      holder,
      expires_at,
      event: { connect: { id: event_id } },
      client: { connect: { id: client_id } }
    },
    include: { client: true, event: { include: { organizer: true } } }
  })
}

export const createTicket = async (
  props: Partial<{
    purchase_id: number
    event_id: number
    holder: string
    code: string
    consumed: boolean
  }> = {}
) => {
  const code = props.code || crypto.randomUUID()
  const holder = props.holder || ''
  const consumed = props.consumed || false
  const event_id = props.event_id || (await createEvent()).id
  const purchase_id = props.purchase_id || (await createPurchase()).id

  return prismaClient.ticket.create({
    data: {
      code,
      holder,
      consumed,
      event: { connect: { id: event_id } },
      purchase: { connect: { id: purchase_id } }
    }
  })
}
