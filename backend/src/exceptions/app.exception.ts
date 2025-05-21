import { HttpException } from '@nestjs/common';

export class AppException extends HttpException {
  constructor(message: string, status: number, options: { cause?: unknown }) {
    super(message, status, options);
    this.name = new.target.name;
    Error.captureStackTrace?.(this, new.target);
  }

  getCause(error: AppException): Record<string, unknown> {
    let resultCause: Record<string, unknown> = {};

    if (error && typeof error === 'object') {
      const cause = error.cause as AppException | undefined;

      resultCause = {
        name: error.name,
        message: error.message,
        stack: error.stack?.split('\n').slice(0, 3).join('\n'),
        ...error.getDetails?.(),
      };

      if (cause && typeof cause === 'object') {
        resultCause.cause = this.getCause(cause);
      }
    }

    return resultCause;
  }

  protected getDetails(): Record<string, unknown> {
    return {};
  }
}
