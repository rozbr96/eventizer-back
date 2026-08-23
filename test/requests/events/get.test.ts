
import request from 'supertest'
import { describe, expect, it } from 'vitest'

import app from '@/app.js'
import { createEvent } from '@test/helpers.js'

describe('GET /events/:id', () => {
  it('returns existing event data', async () => {
    const { id, title, description } = await createEvent()

    const { status, body } = await request(app).get(`/events/${id}`)

    expect(status).toBe(200)
    expect(body).toMatchObject({ id, title, description })
  })

  it('handles invalid id', async () => {
    const { status } = await request(app).get('/events/id')

    expect(status).toBe(404)
  })
})
