
import { describe, expect, it, vi } from 'vitest'

import prismaClient from '@/prisma/client.js'
import type { API } from '@/core/lib/index.js'
import { MovieSearchUseCase } from '@/core/use-cases/index.js'
import { SearchResultRepository } from '@/prisma/repositories/index.js'

describe('MovieSearchUseCase', () => {
  type CustomSearchProps = { page?: number, offset?: number }
  type CustomSearchResult = string

  const searchResultRepository = new SearchResultRepository()

  const getApi = (): API<CustomSearchProps, CustomSearchResult> => {
    return {
      movies: vi.fn(() => Promise.resolve('result')),
    }
  }

  it('calls API', async () => {
    const api = getApi()
    const movieSearchUseCase = new MovieSearchUseCase<CustomSearchProps, CustomSearchResult>(api, searchResultRepository)

    const result = await movieSearchUseCase.execute('movie name', { page: 2 })

    expect(api.movies).toHaveBeenCalledWith('movie name', { page: 2 })
    expect(result).toStrictEqual('result')
  })

  it('uses cached result', async () => {
    await prismaClient.searchResult.create({
      data: {
        key: JSON.stringify({ query: 'movie', props: { page: 2 } }),
        result: JSON.stringify('cached result')
      }
    })

    const api = getApi()
    const movieSearchUseCase = new MovieSearchUseCase(api, searchResultRepository)

    const result = await movieSearchUseCase.execute('movie', { page: 2 })

    expect(api.movies).not.toHaveBeenCalled()
    expect(result).toStrictEqual('cached result')
  })

  it('calls api if cached result is expired', async () => {
    const api = getApi()
    const movieSearchUseCase = new MovieSearchUseCase(api, searchResultRepository)

    const key = JSON.stringify({ query: 'movie', props: { page: 2 } })

    await prismaClient.searchResult.create({
      data: {
        key,
        result: JSON.stringify('cached result'),
        expires_at: new Date(Date.now() - (movieSearchUseCase.THREE_DAYS * 2))
      }
    })

    const result = await movieSearchUseCase.execute('movie', { page: 2 })
    const searchResult = await prismaClient.searchResult.findFirst({
      where: {
        key,
        expires_at: { gt: new Date() }
      }
    })

    expect(api.movies).toHaveBeenCalled()
    expect(result).toStrictEqual('result')
    expect(searchResult).not.toBeNull()
  })
})

