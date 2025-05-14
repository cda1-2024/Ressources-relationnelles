import { UserRole } from 'src/models/user.model';

export const UserRoleToInt: Record<UserRole, number> = {
  [UserRole.SUPERADMIN]: 0,
  [UserRole.ADMIN]: 1,
  [UserRole.MODERATOR]: 2,
  [UserRole.USER]: 3,
  [UserRole.VISITOR]: 4,
};

export const IntToUserRole: Record<number, UserRole> ={
  0: UserRole.SUPERADMIN,
  1: UserRole.ADMIN,
  2: UserRole.MODERATOR,
  3: UserRole.USER,
  4: UserRole.VISITOR,
};
