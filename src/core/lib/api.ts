
export interface SearchResult<T> {
  page: number
  items: Array<T>
  total_pages: number
  total_result: number
}

export interface API<Search, ResultResponse> {
  movies: (query: string, props: Search) => Promise<ResultResponse>
}

