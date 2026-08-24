
import type { UserTokenRepository } from '@/core/repositories/index.js'
import type { UserTokenData } from '@/core/entities/index.js'

export class DeleteUserTokenUseCase {
  constructor(private repository: UserTokenRepository) { }

  execute(user: UserTokenData) {
    return this.repository.delete(user.email)
  }
}
