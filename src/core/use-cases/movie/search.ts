
import type { API } from '@/core/lib/index.js'
import type { SearchResultRepository } from '@/core/repositories/index.js'

export class MovieSearchUseCase<Search, ResultResponse, Result = ResultResponse> {
  THREE_DAYS = 60 * 60 * 24 * 3 * 1000

  constructor(
    private api: API<Search, ResultResponse>,
    private searchResultRepository: SearchResultRepository
  ) { }

  async execute(
    query: string,
    props?: Search,
    presenter?: (resultResponse: ResultResponse) => Result
  ): Promise<Result | ResultResponse> {
    const cacheKey = JSON.stringify({ query, props })

    const cachedResult = await this.searchResultRepository.get(cacheKey)

    if (cachedResult)
      return this.normalizedResult(JSON.parse(cachedResult.result), presenter)

    const resultResponse = await this.api.movies(query, props || {} as Search)

    await this.searchResultRepository.set(
      cacheKey, resultResponse,
      new Date(Date.now() + this.THREE_DAYS)
    )

    return this.normalizedResult(resultResponse, presenter)
  }

  private normalizedResult(
    result: ResultResponse,
    presenter?: (resultResponse: ResultResponse) => Result,
  ) {
    return presenter ? presenter(result) : result
  }
}

