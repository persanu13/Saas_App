import { ThrottlerGuard } from '@nestjs/throttler';
import { Injectable } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected async throwThrottlingException(
    context,
    throttlerLimitDetail,
  ): Promise<void> {
    const retryAfter = Math.ceil(throttlerLimitDetail.timeToBlockExpire);

    throw new HttpException(
      {
        statusCode: 429,
        message: 'Too many requests',
        retryAfter,
      },
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
}
