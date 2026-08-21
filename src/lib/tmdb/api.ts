
import type { API } from '@/core/lib/index.js'

import type {
  MovieSearchResult,
  MoviesSearchProp,
  QueryParams
} from '@/lib/tmdb/entities.js'

class TMDbAPI implements API<MoviesSearchProp, MovieSearchResult> {
  private baseEndpoint = 'https://api.themoviedb.org/3'

  constructor(private token: string) { }

  movies(query: string, props: MoviesSearchProp = {}): Promise<MovieSearchResult> {
    const queryParams: QueryParams = { query }

    if (props.language) queryParams.language = props.language
    if (props.page) queryParams.page = props.page.toString()
    if (props.year) queryParams.year = props.year.toString()

    return new Promise(async (resolve, reject) => {
      const response = await this.request('/search/movie', queryParams)
      const body = await response.json()

      response.ok ? resolve(body as MovieSearchResult) : reject(body)
    })

  }

  private request(endpoint: string, queryParams: QueryParams) {
    const queryString = Object.entries(queryParams)
      .map(([key, value]) => `${key}=${value}`)
      .join('&')

    const url = `${this.baseEndpoint}${endpoint}?${queryString}`

    return fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Accept': 'application/json'
      }
    })
  }
}

export default new TMDbAPI(process.env.TMDb_TOKEN!)

