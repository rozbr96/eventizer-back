
import { faker } from '@faker-js/faker'

import prismaClient from '@/prisma/client.js'
import type { EventCreateInput, UserCreateInput } from '@/prisma/generated/models.js'
import type { Role } from './prisma/generated/enums.js'

const seedUsers = async () => {
  const usersData = [
    { email: 'organizador@email.com', role: 'organizer', name: 'Organizador' },
    { email: 'cliente.a@email.com', role: 'client', name: 'Cliente A' },
    { email: 'cliente.b@email.com', role: 'client', name: 'Cliente B' },
    { email: 'porteiro@email.com', role: 'doorman', name: 'Porteiro' }
  ]

  const promises = usersData.map(({ name, email, role }) => {
    const data: UserCreateInput = {
      email,
      name,
      active: true,
      role: role as Role,
      password: 'password',
    }

    return prismaClient.user.upsert({
      where: { email },
      create: data, update: data
    })
  })

  await Promise.all(promises)
}

const seedEvent = async () => {
  const eventData: EventCreateInput = {
    address: faker.location.streetAddress(),
    address_title: faker.location.secondaryAddress(),
    capacity: faker.number.int({ min: 1, max: 50 }),
    datetime: faker.date.future(),
    description: faker.lorem.paragraph(),
    metadata: {
      adult: false,
      backdrop_path: faker.string.alpha(),
      genre_ids: [],
      id: faker.number.int({ max: 100_000 }),
      title: faker.book.title(),
      original_language: faker.location.language().alpha2,
      original_title: faker.book.title(),
      overview: faker.lorem.paragraph(),
      popularity: faker.number.float({ max: 10 }),
      poster_path: faker.string.alpha(),
      release_date: faker.date.past(),
      softcore: false,
      video: false,
      vote_average: faker.number.float({ max: 10 }),
      vote_count: faker.number.int({ max: 1000 })
    },
    title: faker.lorem.slug(),
    price_in_cents: faker.number.int({ max: 100_000_00 }),
    status: 'published',
    organizer: { connect: { email: 'organizador@email.com' } }
  }

  return prismaClient.event.create({ data: eventData })
}

const seed = async () => {
  await seedUsers()
  await seedEvent()
}

await seed()

