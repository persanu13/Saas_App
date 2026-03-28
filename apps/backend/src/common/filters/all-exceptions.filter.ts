import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from 'generated/prisma/client';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { status, details } = this.getErrorResponse(exception);

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : exception,
      );
    }

    response.status(status).json({
      statusCode: status,
      details,
      timestamp: new Date().toISOString(),
    });
  }

  private isPrismaConnectionError(exception: unknown): boolean {
    if (!(exception instanceof Error)) return false;

    // Initialization errors (cannot connect at startup)
    if (exception.name === 'PrismaClientInitializationError') return true;
    if (exception.name === 'PrismaClientRustPanicError') return true;

    // Known request errors — check by name first, then code
    if (exception.name === 'PrismaClientKnownRequestError') {
      const prismaError = exception as Prisma.PrismaClientKnownRequestError;

      // P1xxx = connection/infrastructure errors
      // P1001 = can't reach DB, P1002 = timeout, P1008 = timeout ops,
      // P1017 = server closed connection
      if (prismaError.code.startsWith('P1')) {
        // <-- era 'P100', trebuie 'P1'
        return true;
      }
    }

    // Fallback: unrecognized Prisma errors prin mesaj
    const msg = exception.message.toLowerCase();
    if (
      msg.includes("can't reach database server") ||
      msg.includes('connection refused') ||
      msg.includes('connection timed out') ||
      msg.includes('server has closed the connection') ||
      msg.includes('connection reset') ||
      msg.includes('econnrefused') ||
      msg.includes('enotfound') ||
      msg.includes('socket hang up')
    ) {
      return true;
    }

    return false;
  }

  private getErrorResponse(exception: unknown): {
    status: number;
    details: object;
  } {
    if (this.isPrismaConnectionError(exception)) {
      return {
        status: HttpStatus.SERVICE_UNAVAILABLE,
        details: { message: 'Database unavailable - service temporarily down' },
      };
    }

    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      let details: object;
      if (typeof response === 'string') {
        details = { message: response };
      } else {
        details = response;
      }

      return {
        status: exception.getStatus(),
        details,
      };
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      details: { message: 'Internal server error' },
    };
  }
}
