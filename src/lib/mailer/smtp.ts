import nodemailer from 'nodemailer'

import { MailerRepository, type MailMessage } from '@/core/repositories/index.js'

export default class extends MailerRepository {
  async send(message: MailMessage): Promise<void> {
    if (!process.env.SMTP_HOST) {
      console.info({
        mail: {
          to: message.to,
          subject: message.subject,
          text: message.text,
        }
      })

      return
    }

    const auth = process.env.SMTP_USER && process.env.SMTP_PASS
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth,
    })

    await transporter.sendMail({
      from: process.env.MAIL_FROM || 'Eventizer <no-reply@eventizer.local>',
      to: message.to,
      subject: message.subject,
      text: message.text,
      html: message.html,
    })
  }
}
