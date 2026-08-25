
import type {
  UserActivationTokenRepository,
  UserRepository,
} from '@/core/repositories/index.js'

interface ActivateUserUseCaseProps {
  email: string
  token: string
}

export class ActivateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private activationTokenRepository: UserActivationTokenRepository
  ) { }

  async execute(props: ActivateUserUseCaseProps) {
    const [user, token] = await Promise.all([
      this.userRepository.findByEmail(props.email),
      this.activationTokenRepository.get(props.email)
    ])

    if (!user || !token || token != props.token) throw {}

    const updatedUser = await this.userRepository.update(props.email, { active: true })
    await this.activationTokenRepository.delete(props.email)

    return updatedUser
  }
}
