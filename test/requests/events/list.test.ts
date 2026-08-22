
import request from 'supertest'

import { beforeEach, describe, expect, it } from 'vitest'

import app from '@/app.js'
import { createEvent } from '@test/helpers.js'

describe('GET /events', () => {
  describe('with existing events', () => {
    beforeEach(async () => { await createEvent({ count: 30 }) })

    it('returns first items', async () => {
      const { status, body } = await request(app).get('/events')

      expect(status).toBe(200)
      expect(body).toMatchObject({
        page: 1,
        total_count: 30,
        total_pages: 2
      })

      expect(body.items.length).toBe(20)
    })

    it('returns items from second page', async () => {
      const { status, body } = await request(app).get('/events').query({ page: 2 })

      expect(status).toBe(200)
      expect(body).toMatchObject({
        page: 2,
        total_count: 30,
        total_pages: 2
      })

      expect(body.items.length).toBe(10)
    })

    it('returns no items for the third page', async () => {
      const { status, body } = await request(app).get('/events').query({ page: 3 })

      expect(status).toBe(200)
      expect(body).toStrictEqual({
        page: 3,
        total_count: 30,
        total_pages: 2,
        items: []
      })
    })

    it('handles non numeric page', async () => {
      const { status, body } = await request(app).get('/events').query({ page: 'a3b' })

      expect(status).toBe(200)
      expect(body).toStrictEqual({
        page: 3,
        total_count: 30,
        total_pages: 2,
        items: []
      })
    })

  })

  describe('without existing events', () => {
    it('returns an empty result', async () => {
      const { status, body } = await request(app).get('/events').send()

      expect(status).toBe(200)
      expect(body).toStrictEqual({
        page: 1,
        items: [],
        total_count: 0,
        total_pages: 0,
      })
    })


    it('handles non numeric page', async () => {
      const { status, body } = await request(app).get('/events').query({ page: 'five' })

      expect(status).toBe(200)
      expect(body).toStrictEqual({
        page: 1,
        total_count: 0,
        total_pages: 0,
        items: []
      })
    })
  })
})
