
import request from 'supertest'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import app from '@/app.js'

describe('POST /movies/search', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn(() => {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(searchResult)
      })
    }))
  })

  describe('with success', () => {
    it('returns data from the external API', async () => {
      const response = await request(app).post('/movies/search').send({})

      expect(response.body).toStrictEqual(searchResult)
    })

    it('returns a cached response', async () => {
      const firstResponse = await request(app).post('/movies/search').send({})
      const secondResponse = await request(app).post('/movies/search').send({})

      expect(firstResponse.body).toStrictEqual(secondResponse.body)
      expect(secondResponse.body).toStrictEqual(searchResult)
      expect(fetch).toHaveBeenCalledOnce()
    })
  })

  describe('with errors', () => {
    it('returns errors', async () => {
      const response = await request(app).post('/movies/search').send({
        page: 0,
        year: -1,
        query: ''
      })

      expect(response.body).toStrictEqual({
        details: [
          '[page] Must be positive'
        ]
      })
    })
  })
})

const searchResult = {
  "page": 1,
  "total_result": 2,
  "total_pages": 1,
  "results": [
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
