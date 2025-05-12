import { UserRole } from 'src/models/user.model';

export const UserRoleToInt: Record<UserRole, number> = {
  [UserRole.SUPERADMIN]: 0,
  [UserRole.ADMIN]: 1,
  [UserRole.MODERATOR]: 2,
  [UserRole.USER]: 3,
  [UserRole.VISITOR]: 4,
};
