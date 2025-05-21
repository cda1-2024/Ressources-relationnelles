import { HttpStatus } from '@nestjs/common';

export function getErrorStatusCode(error: unknown): number {
  return error instanceof Error && 'status' in error ? (error.status as number) : HttpStatus.BAD_REQUEST;
}
