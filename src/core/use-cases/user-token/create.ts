
import jwt from 'jsonwebtoken'

import type { UserTokenData } from '@/core/entities/index.js'
import type { UserTokenRepository } from '@/core/repositories/index.js'

export class CreateUserTokenUseCase {
  constructor(private repository: UserTokenRepository) { }

  execute(props: UserTokenData) {
    return new Promise<string>(async (resolve, reject) => {
      const token = jwt.sign(props, process.env.JWT_SECRET!)

      this.repository
        .set(props.email, token, 3600)
        .then(() => { resolve(token) })
        .catch(reject)
    })
  }
}
