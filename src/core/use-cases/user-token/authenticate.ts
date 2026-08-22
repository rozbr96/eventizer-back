
import * as jwt from 'jsonwebtoken'

import type { UserTokenRepository } from '@/core/repositories/index.js'
import type { UserTokenData } from '@/core/entities/user-token-data.js'

export class AuthenticateUserUseCase {
  constructor(private repository: UserTokenRepository) { }

  async execute(token: string) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET!, async (err, userData) => {
        if (err) return reject()

        const { email } = userData as UserTokenData

        const storedToken = await this.repository.get(email)

        if (token != storedToken) return reject()

        this.repository.set(email, token, 3600)

        resolve(userData)
      })
    })
  }
}

