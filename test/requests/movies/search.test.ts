
import request from 'supertest'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import app from '@/app.js'
import { authenticate, createUser } from '@test/helpers.js'

describe('GET /movies', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn(() => {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(searchResult)
      })
    }))
  })

  const doRequest = async (token: string, data: any = {}) =>
    await request(app).get('/movies')
      .set('Cookie', `token=${token}`).query(data)

  describe('with success', () => {
    it('returns data from the external API', async () => {
      const user = await createUser()
      const token = await authenticate(user)

      const response = await doRequest(token)

      expect(response.body).toStrictEqual(expectedSearchResult)
    })

    it('returns a cached response', async () => {
      const user = await createUser()
      const token = await authenticate(user)

      const firstResponse = await doRequest(token)
      const secondResponse = await doRequest(token)

      expect(firstResponse.body).toStrictEqual(secondResponse.body)
      expect(secondResponse.body).toStrictEqual(expectedSearchResult)
      expect(fetch).toHaveBeenCalledOnce()
    })
  })

  describe('with errors', () => {
    it('without authenticatation', async () => {
      const response = await doRequest('')

      expect(response.status).toBe(401)
    })

    it('returns errors', async () => {
      const user = await createUser()
      const token = await authenticate(user)

      const response = await doRequest(token, { page: 0, year: -1, query: '' })

      expect(response.body).toStrictEqual({
        details: [
          '[page] Must be positive'
        ]
      })
    })
  })
})

const expectedSearchResult = {
  "page": 1,
  "total_count": 2,
  "total_pages": 1,
  "items": [
    {
      "adult": false,
      "backdrop_path": "/1ZFUt0LtYkF568iCkRXCScgBP5g.jpg",
      "genre_ids": [
        14,
        16,
        878,
        10751
      ],
      "id": 20455,
      "title": "Digimon: The Movie",
      "original_language": "en",
      "original_title": "Digimon: The Movie",
      "overview": "When a powerful new Internet Digimon hatches and begins to consume data at an alarming rate, the Digidestined - kids chosen to save the digital world - must put an end to the destruction before the damage becomes irreversible and worldwide communication halts forever. As computer-based missiles are launched, and a wayward Digimon kidnaps the Digidestined, only the combined efforts of a worldwide network of kids and a new group of \"Digidestined\" can rescue the others and stop global disaster.",
      "popularity": 3.1602,
      "poster_path": "/tiH1muonzAWzlLjPhjAcAYVAjzm.jpg",
      "release_date": "2000-10-06",
      "softcore": false,
      "video": false,
      "vote_average": 6.49,
      "vote_count": 304
    },
    {
      "adult": false,
      "backdrop_path": "/xNlNH4Rv0Grba4HR2XIZwgWUFlE.jpg",
      "genre_ids": [
        16,
        12,
        28,
        14,
        10751
      ],
      "id": 97787,
      "title": "Digimon Adventure",
      "original_language": "ja",
      "original_title": "映画 デジモンアドベンチャー",
      "overview": "Two children receive a strange egg that hatches into their very first Digimon, leading to the night that would change their lives forever.",
      "popularity": 2.5367,
      "poster_path": "/tn65LMkjjFFRdhwV2eSFH3WRlwA.jpg",
      "release_date": "1999-03-06",
      "softcore": false,
      "video": false,
      "vote_average": 7.6,
      "vote_count": 96
    }
  ]
}

const searchResult = {
  page: expectedSearchResult.page,
  total_results: expectedSearchResult.total_count,
  total_pages: expectedSearchResult.total_pages,
  results: expectedSearchResult.items
}
