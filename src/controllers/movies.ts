
import type { Request, Response } from 'express'

import tmdbAPI from '@/lib/tmdb/api.js'
import { MovieSearchUseCase } from '@/core/use-cases/movie/search.js'
import { SearchResultRepository } from '@/prisma/repositories/index.js'

const search = (req: Request, resp: Response) => {
  const searchResultRepository = new SearchResultRepository()

  const { query, language, page, year } = req.body
  const props = { language, page, year }

  new MovieSearchUseCase(tmdbAPI, searchResultRepository)
    .execute(query, props)
    .then((result) => { resp.json(result) })
    .catch((err) => { resp.status(400).json(err) })
}

export default { search }

