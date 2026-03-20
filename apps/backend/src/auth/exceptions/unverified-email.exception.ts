import { UnauthorizedException } from '@nestjs/common';
import { ErrorCode } from 'src/common/enums/error-codes.enum';

export class EmailNotVerifiedException extends UnauthorizedException {
  constructor() {
    super({
      code: ErrorCode.EMAIL_NOT_VERIFIED,
      message: 'Please verify your email before logging in.',
    });
  }
}
