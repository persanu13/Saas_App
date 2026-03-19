import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  RequestTimeoutException,
} from '@nestjs/common';
import { catchError, Observable, timeout, TimeoutError } from 'rxjs';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(5000), // 5 secunde
      catchError((err) => {
        if (err instanceof TimeoutError) {
          throw new RequestTimeoutException('Request took too long');
        }
        throw err;
      }),
    );
  }
}
