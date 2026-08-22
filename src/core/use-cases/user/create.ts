
import type { UserRetrieval } from '@/core/entities/index.js'
import { type UserRepository } from '@/core/repositories/index.js'

interface CreateUserUsecaseProps {
  email: string
  password: string
  name: string
}

export class CreateUserUseCase {
  constructor(private repository: UserRepository) { }

  execute(props: CreateUserUsecaseProps): Promise<UserRetrieval> {
    return new Promise((resolve, reject) => {
      this.repository.create({
        ...props,
        active: false,
        role: 'client'
      }).then(resolve).catch((err) => {
        switch (err.code) {
          case 'P2002':
            reject({ detail: 'Email is already in use' })
            break;
        }
      })
    })
  }
}
