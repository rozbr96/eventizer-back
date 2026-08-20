
import { type User } from '@/core/entities/user.js'

export abstract class UserRepository {
  abstract create(user: User): Promise<User>
  abstract findByEmail(email: string): Promise<User | null>
}

