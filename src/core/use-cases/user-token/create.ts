
import * as jwt from 'jsonwebtoken'

import type { UserTokenRepository } from '@/core/repositories/index.js'

interface CreateUserTokenUseCaseProps {
  name: string
  email: string
  role: string
}

export class CreateUserTokenUseCase {
  constructor(private repository: UserTokenRepository) { }

  execute(props: CreateUserTokenUseCaseProps) {
    return new Promise<string>(async (resolve, reject) => {
      const token = jwt.sign(props, process.env.JWT_SECRET!)

      this.repository
        .set(props.email, token, 3600)
        .then(() => { resolve(token) })
        .catch(reject)
    })
  }
}
