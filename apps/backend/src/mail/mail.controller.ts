import { Controller, Get, Post } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get()
  async sendMail() {
    await this.mailService.sendEmail({
      to: 'stamateteodor23@gmail.com',
      subject: 'Welcome to the realm of NestJS',
      template: 'signup-confirmation-email',
      context: {
        name: 'Jhon Doe',
      },
    });
  }
}
