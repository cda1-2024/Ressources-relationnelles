import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/models/user.model';

export const CurrentUser = createParamDecorator((data: unknown, context: ExecutionContext): User => {
  const request = context.switchToHttp().getRequest<Request & { user?: User }>();
  if (!request.user) {
    throw new UnauthorizedException('Aucun utilisateur connecté');
  }
  return request.user;
});
