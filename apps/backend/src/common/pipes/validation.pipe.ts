import { ValidationPipe, BadRequestException } from '@nestjs/common';

export const validationPipe = new ValidationPipe({
  transform: true,
  whitelist: true,
  forbidNonWhitelisted: true,
  exceptionFactory: (errors) => {
    const formattedErrors = errors.reduce(
      (acc, error) => {
        acc[error.property] = Object.values(error.constraints || {});
        return acc;
      },
      {} as Record<string, string[]>,
    );

    return new BadRequestException({
      message: 'Validation failed',
      errors: formattedErrors,
    });
  },
});
