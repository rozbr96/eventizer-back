
import crypto from 'crypto'

import type { UserTokenRepository } from '@/core/repositories/index.js'

interface CreateUserTokenUseCaseProps {
  email: string
}

export class CreateUserTokenUseCase {
  constructor(private repository: UserTokenRepository) { }

  execute(props: CreateUserTokenUseCaseProps) {
    return new Promise<string>(async (resolve, reject) => {
      const token = crypto.randomBytes(32).toString('hex')

      this.repository
        .set(props.email, token, 3600)
        .then(() => { resolve(token) })
        .catch(reject)
    })
  }
}
