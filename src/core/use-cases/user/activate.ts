
import type {
  UserRepository,
  UserTokenRepository
} from '@/core/repositories/index.js'

interface ActivateUserUseCaseProps {
  email: string
  token: string
}

export class ActivateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private userTokenRepository: UserTokenRepository
  ) { }

  execute(props: ActivateUserUseCaseProps) {
    return new Promise((resolve, reject) => {
      const promises = [
        this.userRepository.findByEmail(props.email),
        this.userTokenRepository.get(props.email)
      ]

      Promise
        .all(promises)
        .then(([user, token]) => {
          if (!user || !token || token != props.token) return reject()

          this.userRepository
            .update(props.email, { active: true })
            .then(resolve)
            .catch(reject)
        })
    })

  }
}
