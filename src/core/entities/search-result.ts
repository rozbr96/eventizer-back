
export interface SearchResult {
  key: string
  result: string
  expires_at: Date
}

export interface PaginatedSearchResult<T> {
  page: number
  items: Array<T>
  total_count: number
  total_pages: number
}

