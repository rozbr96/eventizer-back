
import { type UserRepository } from '@/core/repositories/index.js'

interface CreateUserUsecaseProps {
  email: string
  password: string
  name: string
}

export class CreateUserUseCase {
  constructor(private repository: UserRepository) { }

  execute(props: CreateUserUsecaseProps) {
    return this.repository.create({
      ...props,
      active: false,
      role: 'client'
    })
  }
}
