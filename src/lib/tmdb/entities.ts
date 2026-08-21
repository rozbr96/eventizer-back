
export interface QueryParams {
  [key: string]: string
}

export interface MoviesSearchProp {
  language?: 'en-US' | 'es-ES' | 'ja-JP' | 'pt-BR'
  page?: number
  year?: number
}

export interface Movie {
  adult: boolean
  backdrop_path: string
  genre_ids: Array<number>
  id: number
  title: string
  original_language: string
  original_title: string
  overview: string
  popularity: number
  poster_path: string
  release_date: string
  softcore: boolean
  video: boolean
  vote_average: number
  vote_count: number
}

export interface MovieSearchResult {
  page: number
  results: Array<Movie>
  total_pages: number
  total_result: number
}

