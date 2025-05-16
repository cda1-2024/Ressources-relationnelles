import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/models/user.model';

export const CurrentUser = createParamDecorator((data: unknown, context: ExecutionContext): User | undefined => {
  const request = context.switchToHttp().getRequest<Request & { user?: User }>();
  return request.user;
});
