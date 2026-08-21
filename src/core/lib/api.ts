
export interface API<Search, Result> {
  movies: (query: string, props: Search) => Promise<Result>
}

