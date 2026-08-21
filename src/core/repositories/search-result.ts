
import type { SearchResult } from '@/core/entities/index.js'

export abstract class SearchResultRepository {
  abstract get(key: string): Promise<SearchResult>
  abstract set(key: string, value: any, expiresAt: Date): Promise<void>
}

