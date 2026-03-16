import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private mailerService: MailerService) {}

  async sendEmail(params: {
    to: string | string[];
    subject: string;
    template: string;
    context: ISendMailOptions['context'];
  }) {
    try {
      const sendMailParams = {
        to: params.to,
        subject: params.subject,
        template: params.template,
        context: params.context,
      };

      const response = await this.mailerService.sendMail(sendMailParams);
      this.logger.log(`Email sent successfully to ${params.to}`, response);
    } catch (error) {
      this.logger.error(
        `Failed to send email to ${params.to}: ${error.message}`,
      );
    }
  }
}
