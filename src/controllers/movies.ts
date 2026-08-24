
import type { NextFunction, Request, Response } from 'express'

import tmdbAPI, { type Movie, type MovieSearchResult, type MoviesSearchProp } from '@/lib/tmdb/index.js'
import { MovieSearchUseCase } from '@/core/use-cases/index.js'
import { SearchResultRepository } from '@/prisma/repositories/index.js'
import type { PaginatedSearchResult } from '@/core/entities/index.js'

const search = (req: Request, resp: Response, next: NextFunction) => {
  const searchResultRepository = new SearchResultRepository()

  const { query, language, page, year } = req.app.locals.query
  const props = { language, page, year }

  new MovieSearchUseCase<MoviesSearchProp, MovieSearchResult, PaginatedSearchResult<Movie>>(tmdbAPI, searchResultRepository)
    .execute(query, props, (resultResponse) => {
      return {
        total_pages: resultResponse.total_pages,
        total_count: resultResponse.total_results,
        page: resultResponse.page,
        items: resultResponse.results
      }
    })
    .then((result) => { resp.json(result) })
    .catch((err) => { next(err || {}) })
}

export default { search }
