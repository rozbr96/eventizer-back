
import type { API } from '@/core/lib/index.js'
import type { SearchResultRepository } from '@/core/repositories/index.js'

export class MovieSearchUseCase<Search, Result> {
  THREE_DAYS = 60 * 60 * 24 * 3 * 1000

  constructor(
    private api: API<Search, Result>,
    private searchResultRepository: SearchResultRepository
  ) { }

  async execute(query: string, props?: Search) {
    const cacheKey = JSON.stringify({ query, props })

    const cachedResult = await this.searchResultRepository.get(cacheKey)

    if (cachedResult) return JSON.parse(cachedResult.result)

    const result = await this.api.movies(query, props || {} as Search)

    await this.searchResultRepository.set(
      cacheKey, result,
      new Date(Date.now() + this.THREE_DAYS)
    )

    return result
  }
}

