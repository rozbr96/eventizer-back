import { randomUUID } from 'node:crypto'

import type {
  MailerRepository,
  UserActivationTokenRepository,
} from '@/core/repositories/index.js'
import type { UserRetrieval } from '@/core/entities/index.js'

const ACTIVATION_TOKEN_TTL_IN_SECONDS = 3600

interface SendActivationEmailUseCaseProps {
  user: UserRetrieval
}

export class SendActivationEmailUseCase {
  constructor(
    private activationTokenRepository: UserActivationTokenRepository,
    private mailerRepository: MailerRepository
  ) { }

  async execute({ user }: SendActivationEmailUseCaseProps): Promise<string> {
    const token = randomUUID()
    const activationUrl = this.activationUrl(user.email, token)
    const escapedName = this.escapeHtml(user.name)

    await this.activationTokenRepository.set(
      user.email,
      token,
      ACTIVATION_TOKEN_TTL_IN_SECONDS
    )

    await this.mailerRepository.send({
      to: user.email,
      subject: 'Ative sua conta Eventizer',
      text: [
        `Olá, ${user.name},`,
        '',
        'Confirme seu endereço de email para ativar sua conta',
        activationUrl
          ? `Link de ativação: ${activationUrl}`
          : `Token: ${token}`,
      ].join('\n'),
      html: [
        `<p>Olá ${escapedName},</p>`,
        '<p>Confirme seu endereço de email para ativar sua conta</p>',
        activationUrl
          ? `<p><a href="${activationUrl}">Confirmar</a></p>`
          : `<p>Token: <strong>${token}</strong></p>`,
      ].join(''),
    })

    return token
  }

  private activationUrl(email: string, token: string): string | null {
    const baseUrl = process.env.USER_ACTIVATION_URL

    if (!baseUrl) return null

    const url = new URL(baseUrl)
    url.searchParams.set('email', email)
    url.searchParams.set('token', token)

    return url.toString()
  }

  private escapeHtml(value: string): string {
    return value
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;')
  }
}
