import { UnauthorizedException } from '@nestjs/common';
import { ErrorCode } from 'src/common/enums/error-codes.enum';

export class AccountDeactivatedException extends UnauthorizedException {
  constructor() {
    super({
      code: ErrorCode.ACCOUNT_DEACTIVATED,
      message: 'Account is deactivated',
    });
  }
}
