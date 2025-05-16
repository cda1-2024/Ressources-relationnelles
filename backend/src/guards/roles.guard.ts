import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/models/user.model';
import { ROLES_KEY } from './roles.decorator';

const roleHierarchy: Record<UserRole, UserRole[]> = {
  [UserRole.SUPERADMIN]: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR],
  [UserRole.ADMIN]: [UserRole.ADMIN, UserRole.MODERATOR],
  [UserRole.MODERATOR]: [UserRole.MODERATOR],
  [UserRole.USER]: [UserRole.USER, UserRole.VISITOR],
  [UserRole.VISITOR]: [UserRole.VISITOR],
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) return true;

    const { user } = context.switchToHttp().getRequest();
    const userRole: UserRole = user?.role;

    if (!userRole) {
      throw new ForbiddenException('Aucun rôle défini pour cet utilisateur');
    }

    const userRolesExpanded = roleHierarchy[userRole] || [];

    const isAllowed = requiredRoles.some((role) => userRolesExpanded.includes(role));

    if (!isAllowed) {
      throw new ForbiddenException('Accès refusé : rôle insuffisant');
    }

    return true;
  }
}