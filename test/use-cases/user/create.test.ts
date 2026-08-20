
import { describe, expect, it, vi } from 'vitest'

import { CreateUserUseCase } from '@/core/use-cases/index.js'

describe('CreateUserUseCase', () => {
  it('creates a client user as inactive', async () => {
    const repository = {
      create: vi.fn(),
      findByEmail: vi.fn(),
    }

    const useCase = new CreateUserUseCase(repository)

    await useCase.execute({
      email: 'john@example.com',
      password: 'secret',
      name: 'John',
    })

    expect(repository.create).toHaveBeenCalledWith({
      email: 'john@example.com',
      password: 'secret',
      name: 'John',
      active: false,
      role: 'client',
    })
  })
})
