import nodemailer from 'nodemailer'
import { NotificationDto, OrderConfirmationData } from '../../dto/request/notification.dto'
import { QueueNameEnum } from '../../enums/emailType.enum'
import { renderTemplate } from '../../utils/templateUtil'

// Interface cho options gửi mail
export interface SendEmailOptions {
  to: string[]
  subject: string
  text?: string
  html?: string
}

class NodeMailService {
  static transporter: nodemailer.Transporter | null = null

  constructor() {
    if (NodeMailService.transporter === null) {
      NodeMailService.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS
        }
      })
    }
  }

  private async send(options: SendEmailOptions): Promise<nodemailer.SentMessageInfo> {
    try {
      const info = await NodeMailService.transporter?.sendMail({
        from: '"Phạm Tiến Anh" <phama9162@gmail.com>',
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html
      })

      console.log('Email sent:', info.messageId)
      return info
    } catch (error) {
      console.error('Failed to send email:', error)
      throw error
    }
  }

  // public send mail
  async sendMail(notification: NotificationDto): Promise<void> {
    let subject = ''
    let to: string[] = []
    let templateName = ''
    let templateData = {}

    switch (notification.type) {
      case QueueNameEnum.ORDER_CONFIRMATION: {
        const orderNotification = notification as OrderConfirmationData

        subject = `Xác nhận đơn hàng #${orderNotification.orderId}`
        to = orderNotification.email
        templateName = 'order-confirmation.html'
        templateData = {
          orderId: orderNotification.orderId,
          customerName: orderNotification.customerName,
          orderDate: orderNotification.orderDate,
          items: orderNotification.items,
          totalAmount: orderNotification.totalAmount
        }
        break
      }

      default:
        console.log(`Chưa thể gửi mail to ${notification.email}: ${notification.type}`)
        return
    }

    // render html
    const html = await renderTemplate(templateName, templateData)

    const mailPayload: SendEmailOptions = {
      to,
      subject,
      text: html.replace(/<[^>]+>/g, ''),
      html
    }

    await this.send(mailPayload)
  }
}

export default new NodeMailService()