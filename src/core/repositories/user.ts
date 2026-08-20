
import type { UserCreation, UserEdition, UserRetrieval } from '@/core/entities/user.js'

export abstract class UserRepository {
  abstract create(user: UserCreation): Promise<UserRetrieval>
  abstract findByEmail(email: string): Promise<UserRetrieval | null>
  abstract update(email: string, data: UserEdition): Promise<UserRetrieval>
}

