
import type {
  UserRepository,
  UserTokenRepository
} from '@/core/repositories/index.js'

import {
  CreateUserTokenUseCase
} from '@/core/use-cases/index.js'

interface LoginUserUseCaseProps {
  email: string
  password: string
}

export class LoginUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private userTokenRepository: UserTokenRepository
  ) { }

  execute(props: LoginUserUseCaseProps) {
    return new Promise(async (resolve, reject) => {
      const user = await this.userRepository.findByEmail(props.email)

      if (!user) return reject({ detail: 'Invalid Data' })
      if (user.password != props.password) return reject({ detail: 'Invalid Data' })
      if (!user.active) return reject({ detail: 'Inactive User' })

      new CreateUserTokenUseCase(this.userTokenRepository)
        .execute({ email: props.email, role: user.role, name: user.name })
        .then((token) => {
          this.userTokenRepository
            .set(props.email, token)
            .then(() => resolve(token))
            .catch(reject)
        }).catch(reject)
    })
  }
}

