
import { describe, expect, it, vi } from 'vitest'

import { CreateUserTokenUseCase } from '@/core/use-cases/index.js'
import type { UserTokenRepository } from '@/core/repositories/user-token.js'

describe('CreateUserTokenUseCase', () => {
  it('creates token', async () => {
    const repository: UserTokenRepository = {
      get: vi.fn(),
      set: vi.fn(() => Promise.resolve())
    }

    const useCase = new CreateUserTokenUseCase(repository)

    await useCase.execute({ email: 'user@email.com' })

    expect(repository.set).toHaveBeenCalled()
  })
})
