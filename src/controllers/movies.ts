
import type { NextFunction, Request, Response } from 'express'

import tmdbAPI from '@/lib/tmdb/api.js'
import { MovieSearchUseCase } from '@/core/use-cases/index.js'
import { SearchResultRepository } from '@/prisma/repositories/index.js'

const search = (req: Request, resp: Response, next: NextFunction) => {
  const searchResultRepository = new SearchResultRepository()

  const { query, language, page, year } = req.body
  const props = { language, page, year }

  new MovieSearchUseCase(tmdbAPI, searchResultRepository)
    .execute(query, props)
    .then((result) => { resp.json(result) })
    .catch((err) => { next(err || {}) })
}

export default { search }
