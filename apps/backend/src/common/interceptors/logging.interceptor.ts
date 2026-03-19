import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url, ip } = req;
    const userAgent = req.headers['user-agent'] ?? '';
    const userId = req.user?.sub ?? 'guest';
    const start = Date.now();

    return next.handle().pipe(
      tap((response) => {
        const res = context.switchToHttp().getResponse();
        const ms = Date.now() - start;

        this.logger.log(
          `${method} ${url} — ${res.statusCode} — ${ms}ms — user:${userId} — ${ip}`,
        );
      }),
      catchError((error) => {
        const ms = Date.now() - start;

        this.logger.error(
          `${method} ${url} — ${error.status ?? 500} — ${ms}ms — user:${userId} — ${ip} — ${error.message}`,
        );

        return throwError(() => error); // re-arunci eroarea, nu o înghiți
      }),
    );
  }
}
