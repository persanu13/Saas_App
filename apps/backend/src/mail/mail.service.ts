import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendEmail(params: {
    to: string | string[];
    subject: string;
    template: string;
    context: ISendMailOptions['context'];
  }) {
    const sendMailParams = {
      to: params.to,
      subject: params.subject,
      template: params.template,
      context: params.context,
    };
    return await this.mailerService.sendMail(sendMailParams);
  }
}
