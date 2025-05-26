import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export const GlobalValidationPipe = new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
  exceptionFactory: (errors: ValidationError[]) => {
    const formattedErrors: Record<string, string[]> = {};

    errors.forEach((error) => {
      if (error.constraints) {
        formattedErrors[error.property] = Object.values(error.constraints);
      }
    });

    return new BadRequestException({
      message: formattedErrors,
      error: 'Bad Request',
      statusCode: 400,
    });
  },
});
