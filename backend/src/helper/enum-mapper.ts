import { EventType } from 'src/models/event.model';
import { RessourceType, Status, Visibility } from 'src/models/ressource.model';
import { UserRole } from 'src/models/user.model';

export const RessourceStatusToInt: Record<Status, number> = {
  [Status.DELETED]: 0,
  [Status.DRAFT]: 1,
  [Status.PUBLISHED]: 2,
  [Status.SUSPENDED]: 3,
  [Status.TOVALIDATE]: 4,
};

export const RessourceStatusFromInt: Record<number, Status> = {
  0: Status.DELETED,
  1: Status.DRAFT,
  2: Status.PUBLISHED,
  3: Status.SUSPENDED,
  4: Status.TOVALIDATE,
};

export const RessourceVisibilityToInt: Record<Visibility, number> = {
  [Visibility.PRIVATE]: 0,
  [Visibility.PUBLIC]: 1,
  [Visibility.RESTRICTED]: 2,
};

export const RessourceVisibilityFromInt: Record<number, Visibility> = {
  0: Visibility.PRIVATE,
  1: Visibility.PUBLIC,
  2: Visibility.RESTRICTED,
};

export const RessourceTypeToInt: Record<RessourceType, number> = {
  [RessourceType.IMAGE]: 0,
  [RessourceType.PDF]: 1,
  [RessourceType.TEXT]: 2,
  [RessourceType.VIDEO]: 3,
};

export const RessourceTypeFromInt: Record<number, RessourceType> = {
  0: RessourceType.IMAGE,
  1: RessourceType.PDF,
  2: RessourceType.TEXT,
  3: RessourceType.VIDEO,
};

export const EventTypeToInt: Record<EventType, number> = {
  [EventType.MORPION]: 0,
  [EventType.MOTUS]: 1,
  [EventType.SONDAGE]: 2,
};

export const EventTypeFromInt: Record<number, EventType> = {
  0: EventType.MORPION,
  1: EventType.MOTUS,
  2: EventType.SONDAGE,
};

export const UserRoleToInt: Record<UserRole, number> = {
  [UserRole.SUPERADMIN]: 0,
  [UserRole.ADMIN]: 1,
  [UserRole.MODERATOR]: 2,
  [UserRole.USER]: 3,
  [UserRole.VISITOR]: 4,
};

export const IntToUserRole: Record<number, UserRole> = {
  0: UserRole.SUPERADMIN,
  1: UserRole.ADMIN,
  2: UserRole.MODERATOR,
  3: UserRole.USER,
  4: UserRole.VISITOR,
};
