
import request from 'supertest'

import { beforeEach, describe, expect, it } from 'vitest'

import app from '@/app.js'
import { createEvent } from '@test/helpers.js'

describe('GET /events/list', () => {
  describe('with existing events', () => {
    beforeEach(async () => { await createEvent({ count: 30 }) })

    it('returns first items', async () => {
      const { status, body } = await request(app).get('/events/list').send()

      expect(status).toBe(200)
      expect(body).toMatchObject({
        page: 1,
        total_count: 30,
        total_pages: 2
      })

      expect(body.items.length).toBe(20)
    })
  })

  describe('without existing events', () => {
    it('returns an empty result', async () => {
      const { status, body } = await request(app).get('/events/list').send()

      expect(status).toBe(200)
      expect(body).toStrictEqual({
        page: 1,
        items: [],
        total_count: 0,
        total_pages: 0,
      })
    })
  })
})
