
import type { NextFunction, Request, Response } from 'express'

import tmdbAPI, { type MovieSearchResult, type MoviesSearchProp } from '@/lib/tmdb/index.js'
import { type SearchResult } from '@/prisma/generated/client.js'
import { MovieSearchUseCase } from '@/core/use-cases/index.js'
import { SearchResultRepository } from '@/prisma/repositories/index.js'

const search = (req: Request, resp: Response, next: NextFunction) => {
  const searchResultRepository = new SearchResultRepository()

  const { query, language, page, year } = req.app.locals.query
  const props = { language, page, year }

  new MovieSearchUseCase<MoviesSearchProp, MovieSearchResult, SearchResult>(tmdbAPI, searchResultRepository)
    .execute(query, props, (resultResponse) =>
      Object.assign({}, resultResponse, {
        results: undefined, items: resultResponse.results
      }))
    .then((result) => { resp.json(result) })
    .catch((err) => { next(err || {}) })
}

export default { search }
